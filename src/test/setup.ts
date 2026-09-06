import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';
import { afterEach } from 'vitest';

// Enter/exit animations complete immediately under test.
MotionGlobalConfig.skipAnimations = true;

afterEach(() => {
    cleanup();
});
