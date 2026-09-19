import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(__dirname, '../../data/conceptifyyy.db.json');
const GITHUB_REPO = process.env.GITHUB_REPO || 'AtharvBolke99/Project';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_FILE_PATH = 'server/data/conceptifyyy.db.json';

let syncDebounceTimer: NodeJS.Timeout | null = null;
let isSyncing = false;

/**
 * Automatically persists the catalog to external cloud storage (GitHub API / Remote Storage)
 * so that materials added by the admin are NEVER lost when Render's ephemeral container sleeps or restarts.
 */
export async function triggerCloudPersistence(): Promise<void> {
  const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();

  if (!token) {
    // Cloud sync token not yet configured in environment variables
    return;
  }

  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }

  // Debounce sync by 3 seconds to avoid multiple rapid commits
  syncDebounceTimer = setTimeout(async () => {
    if (isSyncing) return;
    isSyncing = true;

    try {
      if (!fs.existsSync(DB_FILE)) {
        isSyncing = false;
        return;
      }

      const fileContent = fs.readFileSync(DB_FILE, 'utf8');
      const base64Content = Buffer.from(fileContent, 'utf8').toString('base64');

      // 1. Get the current file SHA from GitHub
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CONCEPTIFYYY-Persistence-Engine'
        }
      });

      let currentSha: string | undefined;
      if (getRes.ok) {
        const getData = await getRes.json() as { sha?: string };
        currentSha = getData.sha;
      }

      // 2. Commit the updated database snapshot to GitHub
      const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
      const putBody: any = {
        message: 'chore(database): auto-persist admin materials and store catalog [skip ci]',
        content: base64Content,
        branch: GITHUB_BRANCH
      };

      if (currentSha) {
        putBody.sha = currentSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CONCEPTIFYYY-Persistence-Engine'
        },
        body: JSON.stringify(putBody)
      });

      if (putRes.ok) {
        console.log(`🛡️ [Persistence Engine] Successfully committed admin catalog to GitHub (${GITHUB_REPO})!`);
      } else {
        const errText = await putRes.text();
        console.warn(`⚠️ [Persistence Engine] GitHub auto-sync returned status ${putRes.status}:`, errText);
      }
    } catch (err: any) {
      console.warn('⚠️ [Persistence Engine] Error during GitHub auto-sync:', err.message);
    } finally {
      isSyncing = false;
    }
  }, 3000);
}
