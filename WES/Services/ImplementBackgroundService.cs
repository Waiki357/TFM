using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using WES.EFModels.Enum;
using WES.EFModels.Models;

namespace WES.Services
{
    public class ImplementBackgroundService : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            WESDbContext dbContext = new WESDbContext();
            while (!stoppingToken.IsCancellationRequested)
            {
                
                var proyectos = dbContext.Proyectoes.Where(c=> c.FechaFinalizacion < DateTime.Now && c.IdEstadoProyecto == (int)EstadoProyectoEnum.Nuevo).ToList();
                foreach (var proyecto in proyectos)
                {
                    proyecto.IdEstadoProyecto = (int)EstadoProyectoEnum.Finalizado;
                }

                await dbContext.SaveChangesAsync();
                await Task.Delay(TimeSpan.FromHours(24));
            }
        }
    }
}