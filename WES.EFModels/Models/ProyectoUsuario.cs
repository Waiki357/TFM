namespace WES.EFModels.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ProyectoUsuario
    {
        public int Id { get; set; }

        public int? IdProyecto { get; set; }

        public int? IdUsuario { get; set; }

        public int? IdRolProyecto { get; set; }

        public virtual Proyecto Proyecto { get; set; }

        public virtual TTipoRolProyecto TTipoRolProyecto { get; set; }

        public virtual Usuario Usuario { get; set; }
    }
}
