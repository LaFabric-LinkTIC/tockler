// Ensure Electron's path file exists to avoid runtime errors when modules try
// to resolve the binary. This file is normally created during installation but
// is skipped in CI where postinstall scripts do not run.
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const pathFile = join(__dirname, 'node_modules', 'electron', 'path.txt');
if (!existsSync(pathFile)) {
    writeFileSync(pathFile, 'electron');
}

// Mock electron
vi.mock('electron', () => {
    return {
        app: {
            getPath: vi.fn(() => '/mock/path'),
            on: vi.fn(),
            quit: vi.fn(),
        },
        ipcMain: {
            on: vi.fn(),
            handle: vi.fn(),
        },
    };
});

// Mock electron-is-dev
vi.mock('electron-is-dev', () => false);

// Mock node-machine-id
vi.mock('node-machine-id', () => ({
    machineIdSync: vi.fn(() => 'mock-machine-id'),
}));
