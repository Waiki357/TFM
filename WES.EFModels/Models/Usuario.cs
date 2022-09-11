namespace WES.EFModels.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Usuario")]
    public partial class Usuario
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Usuario()
        {
            Proyectoes = new HashSet<Proyecto>();
            ProyectoUsuarios = new HashSet<ProyectoUsuario>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(180)]
        public string Apellidos { get; set; }

        public int Telefono { get; set; }

        public int? Sexo { get; set; }

        public int? Rol { get; set; }

        [Column(TypeName = "date")]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [StringLength(50)]
        public string Token { get; set; }

        public bool Confirmado { get; set; }

        public bool Baja { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Proyecto> Proyectoes { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ProyectoUsuario> ProyectoUsuarios { get; set; }

        public virtual TTipoRolUsuario TTipoRolUsuario { get; set; }

        public virtual TTipoSexo TTipoSexo { get; set; }
    }
}
