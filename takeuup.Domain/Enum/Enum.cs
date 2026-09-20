using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain
{
    public enum EnumDocType
    {
        Brand = 1,
        Category = 2,
        Product = 3,
        ServiceOffer = 4,
        GeneralSetting =5,
        HomePage=6,
        Profile =7,
        Blog=8,
        BlogCategory=9,
        Page=9
    }

    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Paid,
        Shipped,
        Delivered,
        Cancelled
    }


}
