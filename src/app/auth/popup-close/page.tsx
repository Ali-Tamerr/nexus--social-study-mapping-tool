
'use client';

import { useEffect } from 'react';

export default function PopupClose() {
    useEffect(() => {
        // Notify opener that auth is done (optional, depending on how specific we want to be)
        // Notify opener that auth is done
        window.opener?.postMessage({ type: 'NEXUS_AUTH_SUCCESS' }, window.location.origin);

        // Close the popup
        window.close();
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
            <p>Authentication successful. You can close this window.</p>
        </div>
    );
}
