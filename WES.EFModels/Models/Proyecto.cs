namespace WES.EFModels.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Proyecto")]
    public partial class Proyecto
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Proyecto()
        {
            ProyectoUsuarios = new HashSet<ProyectoUsuario>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Titulo { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Column(TypeName = "date")]
        public DateTime FechaCreacion { get; set; }

        [Column(TypeName = "date")]
        public DateTime FechaFinalizacion { get; set; }

        public int? IdEstadoProyecto { get; set; }

        public int? IdCreador { get; set; }

        public virtual Usuario Usuario { get; set; }

        public virtual TTipoEstadoProyecto TTipoEstadoProyecto { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ProyectoUsuario> ProyectoUsuarios { get; set; }
    }
}
