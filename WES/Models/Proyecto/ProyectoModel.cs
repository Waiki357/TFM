namespace WES.Models
{
    public class ProyectoModel
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string? Creador { get; set; }
        public string Descripcion { get; set; }
        public bool EsCreador { get; set; }
        public bool EsInscrito { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaFinalizacion { get; set; }
        public int? IdEstadoProyecto { get; set; }
        public int? IdRolProyecto { get; set; }
    }
}
