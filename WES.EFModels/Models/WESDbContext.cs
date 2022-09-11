using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace WES.EFModels.Models
{
    public partial class WESDbContext : DbContext
    {
        public WESDbContext()
            : base("data source=DESKTOP-6J842J5\\SQLEXPRESS;initial catalog=WomenExperienceSports;integrated security=True;MultipleActiveResultSets=True;App=EntityFramework")
        {
        }

        public virtual DbSet<Proyecto> Proyectoes { get; set; }
        public virtual DbSet<ProyectoUsuario> ProyectoUsuarios { get; set; }
        public virtual DbSet<TTipoEstadoProyecto> TTipoEstadoProyectoes { get; set; }
        public virtual DbSet<TTipoRolProyecto> TTipoRolProyectoes { get; set; }
        public virtual DbSet<TTipoRolUsuario> TTipoRolUsuarios { get; set; }
        public virtual DbSet<TTipoSexo> TTipoSexoes { get; set; }
        public virtual DbSet<UserChat> UserChats { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Proyecto>()
                .Property(e => e.Titulo)
                .IsUnicode(false);

            modelBuilder.Entity<Proyecto>()
                .Property(e => e.Descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<Proyecto>()
                .HasMany(e => e.ProyectoUsuarios)
                .WithOptional(e => e.Proyecto)
                .HasForeignKey(e => e.IdProyecto);

            modelBuilder.Entity<TTipoEstadoProyecto>()
                .Property(e => e.Descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoEstadoProyecto>()
                .Property(e => e.Clave)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoEstadoProyecto>()
                .HasMany(e => e.Proyectoes)
                .WithOptional(e => e.TTipoEstadoProyecto)
                .HasForeignKey(e => e.IdEstadoProyecto);

            modelBuilder.Entity<TTipoRolProyecto>()
                .Property(e => e.Descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoRolProyecto>()
                .Property(e => e.Clave)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoRolProyecto>()
                .HasMany(e => e.ProyectoUsuarios)
                .WithOptional(e => e.TTipoRolProyecto)
                .HasForeignKey(e => e.IdRolProyecto);

            modelBuilder.Entity<TTipoRolUsuario>()
                .Property(e => e.Descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoRolUsuario>()
                .Property(e => e.Clave)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoRolUsuario>()
                .HasMany(e => e.Usuarios)
                .WithOptional(e => e.TTipoRolUsuario)
                .HasForeignKey(e => e.Rol);

            modelBuilder.Entity<TTipoSexo>()
                .Property(e => e.Descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoSexo>()
                .Property(e => e.Clave)
                .IsUnicode(false);

            modelBuilder.Entity<TTipoSexo>()
                .HasMany(e => e.Usuarios)
                .WithOptional(e => e.TTipoSexo)
                .HasForeignKey(e => e.Sexo);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.Password)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.Nombre)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.Apellidos)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.Token)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .HasMany(e => e.Proyectoes)
                .WithOptional(e => e.Usuario)
                .HasForeignKey(e => e.IdCreador);

            modelBuilder.Entity<Usuario>()
                .HasMany(e => e.ProyectoUsuarios)
                .WithOptional(e => e.Usuario)
                .HasForeignKey(e => e.IdUsuario);
        }
    }
}
