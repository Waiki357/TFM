using Microsoft.AspNetCore.SignalR;
using WES.Chat.data;
using WES.Chat.Models;

namespace WES.Chat.hub
{
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();
        public DataAccess _objData = null;

        public async Task SendMessage(vmMessage _message)
        {
            //Receive Message
            List<string> ReceiverConnectionids = _connections.GetConnections(_message.Receiverid).ToList<string>();

            //Salvar el mensaje
            _objData = new DataAccess();
            _message.IsPrivate = true;
            _message.Connectionid = String.Join(",", ReceiverConnectionids);
            await _objData.saveUserChat(_message);
            await Clients.All.SendAsync("UpdateUserList");

            if (ReceiverConnectionids.Count() > 0)
            {
                //Save-Receive-Message
                try
                {
                    await Clients.Clients(ReceiverConnectionids).SendAsync("ReceiveMessage", _message);
                    
                }
                catch (Exception) { }
            }
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext != null)
            {
                try
                {
                    //Add Logged User
                    var userName = httpContext.Request.Query["user"].ToString();
                    var connId = Context.ConnectionId.ToString();
                    _connections.Add(userName, connId);
                }
                catch (Exception) { }
            }

            return Task.CompletedTask;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext != null)
            {
                //Remove Logged User
                var username = httpContext.Request.Query["user"];
                _connections.Remove(username, Context.ConnectionId);
            }
        }

    }
}
