using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WES.EFModels.Models;
using WES.Models.Login;

namespace WES.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel user)
        {
            if (user is null)
                return BadRequest("Invalid client request");

            WESDbContext db = new WESDbContext();            
            var userAutenticado = db.Usuarios.FirstOrDefault(c => c.Email == user.Email && c.Password == user.Password);

            if (userAutenticado != null && userAutenticado.Baja == false && userAutenticado.Confirmado == true)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, userAutenticado.Email),
                    new Claim(ClaimTypes.Role, userAutenticado.TTipoRolUsuario.Descripcion),
                    new Claim(ClaimTypes.Sid, userAutenticado.Id.ToString()),
                    new Claim(ClaimTypes.Gender, userAutenticado.Sexo.ToString()),
                };

                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44427",
                    audience: "http://localhost:44427",
                    claims: claims,
                    expires: DateTime.Now.AddHours(5),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                return Ok(new AuthenticatedResponse { Token = tokenString });
            }

            return Unauthorized();
        }
    }
}
