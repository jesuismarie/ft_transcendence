export type FlushBarOptions = {
    message: string;
    duration?: number; // in milliseconds
    backgroundColor?: string;
    textColor?: string;
};

export function showFlushBar({
                                 message,
                                 duration = 3000,
                                 backgroundColor = '#333',
                                 textColor = '#fff',
                             }: FlushBarOptions): void {
    const flushbar = document.createElement('div');
    flushbar.innerText = message;

    Object.assign(flushbar.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontSize: '14px',
        zIndex: '10000',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
    });

    document.body.appendChild(flushbar);

    requestAnimationFrame(() => {
        flushbar.style.opacity = '1';
    });

    setTimeout(() => {
        flushbar.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(flushbar);
        }, 300);
    }, duration);
}
