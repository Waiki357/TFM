namespace WES.EFModels.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UserChat")]
    public partial class UserChat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Chatid { get; set; }

        [StringLength(50)]
        public string Connectionid { get; set; }

        [StringLength(50)]
        public string Senderid { get; set; }

        [StringLength(50)]
        public string Receiverid { get; set; }

        public string Message { get; set; }

        [StringLength(10)]
        public string Messagestatus { get; set; }

        public DateTime? Messagedate { get; set; }

        public bool? IsGroup { get; set; }

        public bool? IsMultiple { get; set; }

        public bool? IsPrivate { get; set; }
    }
}
