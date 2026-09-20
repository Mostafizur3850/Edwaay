using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs
{
    // =========================
    // ORDER CREATE
    // =========================
    public class OrderCreateDto
    {
        // 🔑 For guest checkout
        public string? SessionId { get; set; }

        // 🛒 Selected cart items
        [Required]
        public List<Guid> CartItemIds { get; set; } = new();

        // 💱 Currency
        public string Currency { get; set; } = "BDT";

        // 🚚 Shipping charge
        public decimal Shipping { get; set; }

        // 💳 COD | SSL
        public string PaymentMethod { get; set; } = "COD";

        // 📍 Delivery address
        [Required]
        public OrderAddressDto Address { get; set; } = null!;

        // =========================
        // 🔐 ACCOUNT CREATION
        // =========================

        // checkbox from frontend
        public bool CreateAccount { get; set; }
        public string? CouponCode { get; set; }
        // only when CreateAccount = true
        public RegisterDataDto? RegisterData { get; set; }
    }

    // =========================
    // REGISTER DATA (GUEST)
    // =========================
    public class RegisterDataDto
    {
        [Required]
        public string FullName { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string PhoneNumber { get; set; } = null!;
    }

    // =========================
    // ORDER RESULT
    // =========================
    public class OrderCreateResultDto
    {
        public Guid OrderId { get; set; }
        public string Status { get; set; } = null!;
        public string? RedirectUrl { get; set; } // only for SSL

        // 🔑 NEW
        public string? TempPassword { get; set; }
        public bool AccountCreated { get; set; }
    }

    // =========================
    // ADDRESS
    // =========================
    public class OrderAddressDto
    {
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string District { get; set; } = null!;
        public string AddressLine { get; set; } = null!;
    }

    // =========================
    // STATUS UPDATE
    // =========================
    public class OrderStatusUpdateDto
    {
        public string Status { get; set; } = null!;
    }



    public class PaymentStatusUpdateDto
    {
        public string PaymentStatus { get; set; } = null!;
    }
}
