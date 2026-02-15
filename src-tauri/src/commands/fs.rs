use serde::Serialize;
use std::fs;
use std::path::Path;
use std::time::SystemTime;

#[derive(Debug, Serialize, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: u64,
    pub children: Option<Vec<FileEntry>>,
}

const HIDDEN_PATTERNS: &[&str] = &[
    "node_modules",
    ".git",
    "__pycache__",
    ".DS_Store",
    "target",
    ".next",
    "dist",
    ".cache",
];

fn should_hide(name: &str) -> bool {
    HIDDEN_PATTERNS.iter().any(|p| name == *p)
}

fn modified_secs(modified: std::io::Result<SystemTime>) -> u64 {
    modified
        .ok()
        .and_then(|t| t.duration_since(SystemTime::UNIX_EPOCH).ok())
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

fn read_dir_recursive(path: &Path, depth: u32, max_depth: u32) -> Vec<FileEntry> {
    let mut entries = Vec::new();

    let Ok(read_dir) = fs::read_dir(path) else {
        return entries;
    };

    for entry in read_dir.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();

        if should_hide(&name) {
            continue;
        }

        let Ok(metadata) = entry.metadata() else {
            continue;
        };

        let is_dir = metadata.is_dir();
        let children = if is_dir && depth < max_depth {
            Some(read_dir_recursive(&entry.path(), depth + 1, max_depth))
        } else if is_dir {
            Some(Vec::new())
        } else {
            None
        };

        entries.push(FileEntry {
            name,
            path: entry.path().to_string_lossy().to_string(),
            is_dir,
            size: metadata.len(),
            modified: modified_secs(metadata.modified()),
            children,
        });
    }

    entries.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    entries
}

#[tauri::command]
pub fn read_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", path.display()));
    }

    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", path.display()));
    }

    Ok(read_dir_recursive(path, 0, 10))
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}
