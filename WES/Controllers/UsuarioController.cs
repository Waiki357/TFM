using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;
using Newtonsoft.Json;
using System.Data.Entity;
using WES.EFModels.Enum;
using WES.EFModels.Models;
using WES.Models;
using WES.Chat.data;
using WES.Chat.Models;
using Newtonsoft.Json.Linq;
using WES.Models.Login;

namespace WomanSportExperience.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {

        private DataAccess _objChat = null;

        public UsuarioController()
        {
            this._objChat = new DataAccess();
        }

        [HttpGet("GetTipoSexo")]
        public string GetTipoSexo()
        {
            WESDbContext dbContext = new WESDbContext();
            var lista = dbContext.TTipoSexoes.Select(c => new ListaItem()
            {
                Id = c.Id,
                Descripcion = c.Descripcion,
            }).ToList();

            lista.Insert(0, new ListaItem() { Id = -1, Descripcion = "Seleccione una opción" });

            return JsonConvert.SerializeObject(lista);
        }

        [HttpGet("GetUsuario"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetUsuario()
        {
            WESDbContext dbContext = new WESDbContext();
            var usuario = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name);

            UsuarioModel model = new UsuarioModel()
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                Apellidos = usuario.Apellidos,
                Telefono = usuario.Telefono,
                Password = usuario.Password,
                Sexo = usuario.Sexo.Value,
                FechaNacimiento = usuario.FechaNacimiento
            };

            return JsonConvert.SerializeObject(model);
        }

        [HttpDelete("DeleteUsuario"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult DeleteUsuario(UsuarioModel usuario)
        {
            WESDbContext dbContext = new WESDbContext();
            try
            {
                var usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name);
                usuarioDb.Baja = true;

                dbContext.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost("UpdateUsuario"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult UpdateUsuario(UsuarioModel usuario)
        {
            WESDbContext dbContext = new WESDbContext();
            try
            {
                var usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name);
                usuarioDb.Nombre = usuario.Nombre;
                usuarioDb.Apellidos = usuario.Apellidos;
                usuarioDb.FechaNacimiento = usuario.FechaNacimiento;
                usuarioDb.Telefono = usuario.Telefono;

                dbContext.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost("CrearUsuario")]
        public ActionResult CrearUsuario(UsuarioModel usuario)
        {
            WESDbContext dbContext = new WESDbContext();
            using (DbContextTransaction transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var usuarioDb = new Usuario()
                    {
                        Email = usuario.Email,
                        Password = usuario.Password,
                        Nombre = usuario.Nombre,
                        Apellidos = usuario.Apellidos,
                        Sexo = usuario.Sexo,
                        FechaNacimiento = usuario.FechaNacimiento,
                        Telefono = usuario.Telefono,
                        Rol = (int)RolUsuarioEnum.Normal,
                        Token = Guid.NewGuid().ToString(),
                    };

                    dbContext.Usuarios.Add(usuarioDb);
                    dbContext.SaveChanges();

                    var verificationUrl = $"{this.Request.Scheme}://{this.Request.Host}/verificacion?id=" + usuarioDb.Token;
                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse("waiki357@gmail.com"));
                    email.To.Add(MailboxAddress.Parse(usuario.Email));
                    email.Subject = "Bienvenid@ a WES";
                    email.Body = new TextPart(TextFormat.Html)
                    {
                        Text = "<h1>Bienvenid@ a la comunidad más grande del mundo de Mujeres en Gestión Deportiva</h1>" +
                        "<br>Para activar tu cuenta de usuario necesitamos que verifiques tu dirección de email pulsando el siguiente enlace: <a href='" + verificationUrl + "'>" + verificationUrl + "</a>" +
                        "<br>Tras verificar tu dirección de email podrás hacer uso de todos los servicios disponibles en tu cuenta de usuario. Solo nos queda darte la bienvenida a WES y agradecer tu confianza en nosotros." +
                        (usuarioDb.Sexo == (int)SexoEnum.Hombre ? "<br>Recordar que los usuarios varones no podrán inscribirse a ningún proyecto, solo pueden crearlos y gestionarlos" : "")
                    };

                    // send email
                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    smtp.Authenticate("waiki357@gmail.com", "meqlhhuvadgvnbcc");
                    smtp.Send(email);
                    smtp.Disconnect(true);

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    return StatusCode(500);
                }
            }

            return Ok();
        }

        [HttpGet("Verificacion/{id}")]
        public ActionResult Verificacion(string id)
        {
            WESDbContext dbContext = new WESDbContext();
            var usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Token == id);

            if (usuarioDb != null)
            {
                usuarioDb.Confirmado = true;
                dbContext.SaveChanges();
            }
            else
                return StatusCode(500);

            return Ok();
        }

        [HttpPost("UpdatePasswordUsuario")]
        public ActionResult UpdatePasswordUsuario([FromBody] PasswordModel data)
        {
            WESDbContext dbContext = new WESDbContext();
            try
            {
                string password = data.Password;
                string token = data.Token;
                Usuario usuarioDb;

                if (string.IsNullOrEmpty(token))
                {
                    if(User.Claims.Count() == 0)
                        return StatusCode(500);
                    usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name);

                }
                else
                {
                    usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Email == data.Email);
                }

                usuarioDb.Password = password;
                dbContext.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost("RecoveryEmailUsuario")]
        public ActionResult RecoveryEmailUsuario([FromBody] string email)
        {
            WESDbContext dbContext = new WESDbContext();
            try
            {
                var usuarioDb = dbContext.Usuarios.FirstOrDefault(c => c.Email == email);

                if (usuarioDb != null)
                {

                    var recuperacionUrl = $"{this.Request.Scheme}://{this.Request.Host}/recuperacion?id=" + usuarioDb.Token+"&email=" + usuarioDb.Email;
                    var emailSend = new MimeMessage();
                    emailSend.From.Add(MailboxAddress.Parse("waiki357@gmail.com"));
                    emailSend.To.Add(MailboxAddress.Parse(usuarioDb.Email));
                    emailSend.Subject = "Recuperación contraseña";
                    emailSend.Body = new TextPart(TextFormat.Html)
                    {
                        Text = "<h1>Restablecimiento de contraseña</h1>" +
                        "Hemos recibido una solicitud de restablecimiento de tu contraseña. Confírmala para elegir una nueva. Si no deseas restablecerla, puedes ignorar este correo electrónico.: <a href='" + recuperacionUrl + "'>" + recuperacionUrl + "</a>"
                    };

                    // send email
                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    smtp.Authenticate("waiki357@gmail.com", "meqlhhuvadgvnbcc");
                    smtp.Send(emailSend);
                    smtp.Disconnect(true);
                }
                else
                {
                    Ok("No existe usuario con ese correo asociado");
                }
                
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        #region Chat

        [HttpGet("UserChat"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public async Task<object> userChat([FromQuery] string param)
        {
            object result = null; object resdata = null;

            try
            {
                if (param != string.Empty)
                {
                    dynamic data = JsonConvert.DeserializeObject(param);
                    UserChat model = JsonConvert.DeserializeObject<UserChat>(data.ToString());
                    if (model != null)
                    {
                        resdata = await _objChat.getUserChat(model);
                    }
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
            }

            result = new
            {
                resdata
            };

            return result;
        }

        [HttpGet("GetUsersChat"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetUsersChat()
        {
            WESDbContext dbContext = new WESDbContext();
            var listaUsuarioR = dbContext.UserChats.Where(c=> c.Senderid == User.Identity.Name).OrderByDescending(v=> v.Messagedate).Select(x=> new UsuarioChatResumen() { Email = x.Receiverid, Mensaje = x.Message, FechaMensaje = x.Messagedate.Value }).ToList().DistinctBy(c=> c.Email).ToList();
            var listaUsuarioS = dbContext.UserChats.Where(c=> c.Receiverid == User.Identity.Name).OrderByDescending(v => v.Messagedate).Select(x => new UsuarioChatResumen() { Email = x.Senderid, Mensaje = x.Message, FechaMensaje = x.Messagedate.Value }).ToList().DistinctBy(c => c.Email).ToList();
            List<UsuarioChatResumen> listaFinal = listaUsuarioR.Union(listaUsuarioS).OrderByDescending(c=> c.FechaMensaje).DistinctBy(c => c.Email).ToList();

            return JsonConvert.SerializeObject(listaFinal);
        }

        #endregion
    }
}

