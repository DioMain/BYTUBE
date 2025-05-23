﻿using static BYTUBE.Entity.Models.Channel;

namespace BYTUBE.Models.ChannelModels
{
    public class ChannelModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Subscribes { get; set; }

        public ActiveStatus Status { get; set; }

        public bool IsSubscripted { get; set; }

        public string IconUrl { get; set; }
    }
}
