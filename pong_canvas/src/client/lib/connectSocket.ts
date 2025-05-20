export const connectSocket = (): Promise<{socket: WebSocket; side: 'left' | 'right'}> => {
    return new Promise( (resolve, reject) => {
        const socket = new WebSocket("ws://localhost:4000");

        socket.onopen = () => console.log("Connected to server");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'assign_side') {
                resolve({ socket, side: data.side });
            }
        };

        socket.onerror = (err) => reject(err);

    } )
}