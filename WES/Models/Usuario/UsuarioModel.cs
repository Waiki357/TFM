namespace WES.Models
{
    public class UsuarioModel
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Nombre { get; set; }
        public string? Apellidos { get; set; }
        public int Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public int Sexo { get; set; }
        public string? SexoTexto { get; set; }
        public int Rol { get; set; }
        public string? RolTexto { get; set; }
    }
}
