﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BYTUBE.Entity.Models
{
    public class Channel
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;

        public DateTime Created {  get; set; } = DateTime.Now.ToUniversalTime();

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? Owner { get; set; }

        public List<Video> Videos { get; set; } = [];

        public List<Subscribe> Subscribes { get; set; } = [];
    }
}
