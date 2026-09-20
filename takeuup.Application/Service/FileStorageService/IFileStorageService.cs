using ECommerce.Application.DTOs;
using ECommerce.Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Service
{
    public interface IFileStorageService
    {
        Task<List<VMDocInfoDTO>> UploadImageAsync(IFormFileCollection files, string contentCateogry, Guid id,string UploadPrefix, CancellationToken ct);
        Task DeletePrevFilesAsync( EnumDocType docType,   string contentCategory,  Guid sourceId,   CancellationToken ct);
        Task DeleteSingleGalleryImageAsync(Guid productId, string imagePath, CancellationToken ct);
    }

}

