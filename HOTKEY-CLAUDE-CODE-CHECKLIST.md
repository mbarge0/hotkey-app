# HotKey Claude Code - Dev Checklist

Tasks are sequential. Complete each before moving to the next.

---

- [ ] **Task 1:** Create `.claude/commands/` directory structure in repo
- [ ] **Task 2:** Write `.claude/commands/story.md` - the core slash command
- [ ] **Task 3:** Create `content-inbox/` directory in repo (with `.gitkeep`), update `.gitignore` to track story files
- [ ] **Task 4:** Update `content-watcher.js` - change CONTENT_INBOX to repo-local path, keep iCloud as fallback
- [ ] **Task 5:** Fix username `mattbarge` → `matthewbarge` in `scripts/generate-with-claude.js` prompt
- [ ] **Task 6:** Commit and push all changes
