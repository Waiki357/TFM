using WES.Chat.Models;
using WES.EFModels.Models;

namespace WES.Chat.data
{
    public class DataAccess
    {
        private WESDbContext DbContext = null;

        public async Task<object> saveUserChat(vmMessage _model)
        {
            string message = string.Empty;
            try
            {
                using (DbContext = new WESDbContext())
                {
                    UserChat model = new UserChat()
                    {
                        Chatid = DbContext.UserChats.DefaultIfEmpty().Max(x => x == null ? 0 : x.Chatid) + 1,
                        Connectionid = _model.Connectionid,
                        Senderid = _model.Senderid,
                        Receiverid = _model.Receiverid,
                        Message = _model.Message,
                        Messagestatus = _model.Messagestatus,
                        Messagedate = _model.Messagedate,
                        IsGroup = _model.IsGroup,
                        IsPrivate = _model.IsPrivate,
                        IsMultiple = _model.IsMultiple
                    };
                    DbContext.UserChats.Add(model);
                    await DbContext.SaveChangesAsync();
                    message = "Saved";
                }
            }
            catch (Exception ex)
            {
                message = "Error:" + ex.ToString();
            }
            return message;
        }

        public Task<List<UserChat>> getUserChat(UserChat model)
        {
            return Task.Run(() =>
            {
                List<UserChat> userChat = null;
                try
                {
                    using (DbContext = new WESDbContext())
                    {
                        userChat = (from x in DbContext.UserChats
                                    where (x.Senderid == model.Senderid && x.Receiverid == model.Receiverid) || (x.Receiverid == model.Senderid && x.Senderid == model.Receiverid)
                                    select x).ToList();
                    }
                }
                catch (Exception ex)
                {
                    ex.ToString();
                    userChat = null;
                }

                return userChat;
            });
        }
    }
}
