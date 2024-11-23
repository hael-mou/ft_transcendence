

/* **************************************************************************** #
#   * wsManager Component Class :                                               #
# **************************************************************************** */
class WebSocketManager
{
    /* === constructor : ===================================================== */
    constructor(url, reconnectTimeout = 3000)
    {
        this.url = url;
        this.socket = null;
        this.listeners = {};
        this.dataToBeSentLater = [];
        this.isReconnecting = false;
        this.reconnectTimeout = reconnectTimeout;
        this.initReconnectTimeout = reconnectTimeout;
    }

    /* === connect : ========================================================= */
    connect()
    {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return ;

        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            console.log('WebSocket connection opened');
            this.reconnectTimeout = this.initReconnectTimeout;
            this.sendLaterMessages();
            this.callListeners('open', this.getContext(event), event);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed');
            if (!this.isReconnecting) {
                this.isReconnecting = true;
                this.reconnect();
            }
            this.callListeners('close', this.getContext(event), event);
        };

        this.socket.onmessage = (event) => {
            this.sendLaterMessages();
            this.callListeners('message', this.getContext(event), event);
        };

        this.socket.onerror = (event) => {
            this.callListeners('error', this.getContext(event), event);
        };
    }

    /* === reconnect : ====================================================== */
    reconnect()
    {
        setTimeout(() => {
            this.connect();
            this.isReconnecting = false;
        }, this.reconnectTimeout);
        this.reconnectTimeout = Math.min(this.reconnectTimeout * 2, 30000);
    }

    /* === getContext : ====================================================== */
    getContext(event)
    {
        if (!event?.data) return "unknown";
        return JSON.parse(event.data).type;
    }

    /* === callListeners : =================================================== */
    callListeners(event, constext, data)
    {
        if (this.listeners[event]?.[constext])
        {
            this.listeners[event][constext].forEach(callback => callback(data));
        }
    }

    /* === addListener : ===================================================== */
    addListener(event, context, callback)
    {
        if (!this.listeners[event]) this.listeners[event] = {};
        if (!this.listeners[event][context]) this.listeners[event][context] = [];
        this.listeners[event][context].push(callback);
        console.log(this.listeners);
    }

    /* === removeListener : ================================================== */
    removeListener(event, context, callback)
    {
        if (this.listeners[event]?.[context])
        {
            this.listeners[event][context] =
                this.listeners[event][context].filter(
                    listener => listener !== callback
                );
        }
    }

    /* === send : ============================================================ */
    send(data, force = true)
    {
        if (this.socket && this.socket.readyState === WebSocket.OPEN)
        {
            this.socket.send(data);
        } else if (force) {
            this.dataToBeSentLater.push(data);
        }
    }

    /* === sendLaterMessages : =============================================== */
    sendLaterMessages()
    {
        const pendingMessages = [...this.dataToBeSentLater];
        this.dataToBeSentLater = [];
        pendingMessages.forEach(msg => this.send(msg));
    }

}

/* *************************************************************************** */
/*   * wsm Instance exported :                                                 */
/* *************************************************************************** */
export const wsm = new WebSocketManager();
