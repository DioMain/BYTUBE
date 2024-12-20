﻿using System.ComponentModel.DataAnnotations;

namespace BYTUBE.Models
{
    public class SigninModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
