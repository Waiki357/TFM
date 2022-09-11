using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WES;
using WES.EFModels.Enum;
using WES.EFModels.Models;
using WES.Models;

namespace WomanSportExperience.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProyectoController : ControllerBase
    {

        [HttpGet("GetProyectos"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetProyectos()
        {
            WESDbContext dbContext = new WESDbContext();
            var usuario = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name);
            
            List<ProyectoModel> proyectos = new List<ProyectoModel>();
            if (usuario.Sexo == (int)SexoEnum.Hombre)
            {
                proyectos = dbContext.ProyectoUsuarios.Where(x => x.Proyecto.IdCreador == usuario.Id).Select(c => new ProyectoModel()
                {
                    Id = c.Id,
                    Titulo = c.Proyecto.Titulo,
                    Descripcion = c.Proyecto.Descripcion,
                    Creador = c.Proyecto.Usuario.Nombre + " " + c.Proyecto.Usuario.Apellidos,
                    FechaCreacion = c.Proyecto.FechaCreacion,
                    FechaFinalizacion = c.Proyecto.FechaFinalizacion,
                    IdEstadoProyecto = c.Proyecto.IdEstadoProyecto,
                    IdRolProyecto = c.IdRolProyecto
                }).ToList();
            }
            else
            {
                proyectos = dbContext.ProyectoUsuarios.Where(x => x.IdUsuario == usuario.Id).Select(c => new ProyectoModel()
                {
                    Id = c.Id,
                    Titulo = c.Proyecto.Titulo,
                    Descripcion = c.Proyecto.Descripcion,
                    Creador = c.Proyecto.Usuario.Nombre + " " + c.Proyecto.Usuario.Apellidos,
                    FechaCreacion = c.Proyecto.FechaCreacion,
                    FechaFinalizacion = c.Proyecto.FechaFinalizacion,
                    IdEstadoProyecto = c.Proyecto.IdEstadoProyecto,
                    IdRolProyecto = c.IdRolProyecto
                }).ToList();
            }

            return JsonConvert.SerializeObject(proyectos);
        }

        [HttpGet("Busqueda"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string Busqueda(string name)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id;
            var lista = dbContext.Proyectoes.Where(x => x.IdEstadoProyecto == (int)EstadoProyectoEnum.Nuevo && x.Titulo.ToLower().Contains(name)).Select(c => new ProyectoModel()
            {
                Id = c.Id,
                Titulo = c.Titulo,
                Descripcion = c.Descripcion,
                Creador = c.Usuario.Nombre + " " + c.Usuario.Apellidos,
                FechaCreacion = c.FechaCreacion,
                FechaFinalizacion = c.FechaFinalizacion,
                EsCreador = c.IdCreador == userId,
                EsInscrito = c.ProyectoUsuarios.Any(v=> v.IdUsuario == userId) && c.IdCreador != userId,
            }).ToList();

            return JsonConvert.SerializeObject(lista);
        }

        #region CRUD Proyectos

        [HttpPost("addProyecto"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult addProyecto(ProyectoModel proyecto)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id;

            var proyectoDb = new Proyecto()
            {
                Titulo = proyecto.Titulo,
                Descripcion = proyecto.Descripcion,
                IdCreador = userId,
                IdEstadoProyecto = (int)EstadoProyectoEnum.Nuevo,
                FechaCreacion = DateTime.Now,
                FechaFinalizacion = proyecto.FechaFinalizacion
            };

            dbContext.Proyectoes.Add(proyectoDb);
            dbContext.SaveChanges();

            dbContext.ProyectoUsuarios.Add(new ProyectoUsuario()
            {
                IdProyecto = proyectoDb.Id,
                IdUsuario = userId,
                IdRolProyecto = (int)RolProyectoEnum.Creador
            });
            dbContext.SaveChanges();

            return Ok();
        }        

        [HttpDelete("DeleteProyecto/{id}"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult DeleteProyecto(int id)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id;

            dbContext.ProyectoUsuarios.RemoveRange(dbContext.ProyectoUsuarios.Where(c => c.IdProyecto == id));
            dbContext.Proyectoes.Remove(dbContext.Proyectoes.FirstOrDefault(c => c.Id == id));
            dbContext.SaveChanges();

            return Ok();
        }

        [HttpPut("UpdateProyecto"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult UpdateProyecto(ProyectoModel proyecto)
        {
            WESDbContext dbContext = new WESDbContext();

            var proyectoDb = dbContext.Proyectoes.FirstOrDefault(c => c.Id == proyecto.Id);

            proyectoDb.Titulo = proyecto.Titulo;
            proyectoDb.Descripcion = proyecto.Descripcion;
            proyecto.FechaFinalizacion = proyecto.FechaFinalizacion;

            dbContext.SaveChanges();

            return Ok();
        }

        #endregion

        #region CRUD Usuarios Proyectos

        [HttpGet("GetUsuariosProyectos/{id}"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetUsuariosProyectos(int id)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id;

            var lista = dbContext.ProyectoUsuarios.Where(x => x.IdProyecto == id && x.IdUsuario != userId && x.IdProyecto !=(int)RolProyectoEnum.Eliminado).Select(c => new UsuarioModel()
            {
                Id = c.Usuario.Id,
                Nombre = c.Usuario.Nombre,
                Apellidos = c.Usuario.Apellidos,
                Telefono = c.Usuario.Telefono,
                Email = c.Usuario.Email,
            });

            return JsonConvert.SerializeObject(lista);
        }

        [HttpPost("AddUsuarioProyecto/{id}"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult AddUsuarioProyecto(int id)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id;

            var usuarioProyectos = dbContext.ProyectoUsuarios.FirstOrDefault(c => c.IdProyecto == id && c.IdUsuario == userId);
            if (usuarioProyectos == null)
            {

                dbContext.ProyectoUsuarios.Add(new ProyectoUsuario()
                {
                    IdProyecto = id,
                    IdUsuario = userId,
                    IdRolProyecto = 1
                });

                dbContext.SaveChanges();
            }

            return Ok();
        }

        [HttpPost("DeleteUsuarioProyecto/{id}/{idUsuario}"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public ActionResult DeleteUsuarioProyecto(int id, int idUsuario)
        {
            WESDbContext dbContext = new WESDbContext();
            int userId = idUsuario == 0 ? dbContext.Usuarios.FirstOrDefault(c => c.Email == User.Identity.Name).Id : idUsuario;

            var usuarioProyectos = dbContext.ProyectoUsuarios.FirstOrDefault(c => c.IdProyecto == id && c.IdUsuario == userId);
            if (usuarioProyectos != null)
            {
                if (idUsuario == 0)
                    dbContext.ProyectoUsuarios.Remove(usuarioProyectos);
                else
                    usuarioProyectos.IdRolProyecto = (int)RolProyectoEnum.Eliminado;
                dbContext.SaveChanges();
            }

            return Ok();
        }

        #endregion

        #region DashBoard

        [HttpGet("GetProyectosCreadosFinalizados"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetProyectosCreadosFinalizados()
        {
            WESDbContext dbContext = new WESDbContext();
            List<int> result = dbContext.Proyectoes.GroupBy(x => x.IdEstadoProyecto).Select(c => c.Count()).ToList();
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet("GetUsuariosSinProyecto"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetUsuariosSinProyecto()
        {
            WESDbContext dbContext = new WESDbContext();
            List<int> result = new List<int>();
            result.Add(dbContext.Usuarios.Count());
            result.Add(dbContext.Usuarios.Where(x => x.ProyectoUsuarios.Count() == 0).Count());
            
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet("GetUsuariosEdad"), Authorize(Roles = "Administrador, Propietaria, Normal")]
        public string GetUsuariosEdad()
        {
            WESDbContext dbContext = new WESDbContext();

            List<int> result = new List<int>();
            result.Add(dbContext.Usuarios.AsEnumerable().Where(c => Tools.GetAge(c.FechaNacimiento) < 30).Count());
            result.Add(dbContext.Usuarios.AsEnumerable().Where(c => Tools.GetAge(c.FechaNacimiento) >= 30 && Tools.GetAge(c.FechaNacimiento) < 40).Count());
            result.Add(dbContext.Usuarios.AsEnumerable().Where(c => Tools.GetAge(c.FechaNacimiento) >= 40 && Tools.GetAge(c.FechaNacimiento) < 50).Count());
            result.Add(dbContext.Usuarios.AsEnumerable().Where(c => Tools.GetAge(c.FechaNacimiento) >= 50 && Tools.GetAge(c.FechaNacimiento) < 60).Count());
            result.Add(dbContext.Usuarios.AsEnumerable().Where(c => Tools.GetAge(c.FechaNacimiento) >= 60).Count());

            return JsonConvert.SerializeObject(result);
        }        

        #endregion

    }

    public static class Tools
    {
        public static int GetAge(this DateTime dateOfBirth)
        {
            var today = DateTime.Today;

            var a = (today.Year * 100 + today.Month) * 100 + today.Day;
            var b = (dateOfBirth.Year * 100 + dateOfBirth.Month) * 100 + dateOfBirth.Day;

            return (a - b) / 10000;
        }
    }
}
