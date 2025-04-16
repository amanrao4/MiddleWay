// src/hooks/useRouterReady.js
import { useLocation } from 'react-router-dom';

export default function useRouterReady() {
    try {
        useLocation(); // If Router isn't mounted, this throws
        return true;
    } catch {
        return false;
    }
}
