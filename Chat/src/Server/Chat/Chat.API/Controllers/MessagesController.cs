﻿using Chat.Infrastructure.Repositories.Messages;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;

        public MessagesController(IMessageRepository messageRepository)
            => _messageRepository = messageRepository;

        [HttpGet]
        public async Task<IActionResult> GetAllMessages()
        {
            return Ok(_messageRepository.GetAll().ToList());
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMessage(Guid messageId)
        {
            return Ok();
        }
    }
}
