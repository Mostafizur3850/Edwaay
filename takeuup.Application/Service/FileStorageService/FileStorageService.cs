using ECommerce.Application.DTOs;
using ECommerce.Domain;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.EntityFrameworkCore;


namespace ECommerce.Application.Service
{
    public class FileStorageService : IFileStorageService
    {  
        private readonly IWebHostEnvironment _env;
        private readonly IDocumentsInfoService _documentsInfoService;
        private readonly IProductImageService _productImageService;
        public FileStorageService( IWebHostEnvironment env, IDocumentsInfoService documentsInfoService, IProductImageService productImageService)
        {
                _env = env;
            _documentsInfoService = documentsInfoService;
            _productImageService = productImageService;
        }   

        public async Task<List<VMDocInfoDTO>> UploadImageAsync( IFormFileCollection files,  string contentCategory,   Guid sourceId, string UploadPrefix,  CancellationToken ct)
        {
            var result = new List<VMDocInfoDTO>();
            var root = Path.Combine(  _env.WebRootPath, "Content", "photos", contentCategory, sourceId.ToString());

            Directory.CreateDirectory(root);

            foreach (var file in files)
            {
                if (file == null || file.Length == 0) continue;
                var safeName = CleanFileName(file.FileName);
                var fileName = $"{UploadPrefix}{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeName}";
                var fullPath = Path.Combine(root, fileName);
                await using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream, ct);
                result.Add(new VMDocInfoDTO
                {
                    DocName = fileName,
                    DocPath = $"Content/photos/{contentCategory}/{sourceId}/{fileName}"
                });
            }

            return result;
        }


        public async Task DeletePrevFilesAsync( EnumDocType docType, string contentCategory,  Guid sourceId,   CancellationToken ct)
        {

            if (docType == EnumDocType.Product)
            {
                var docss = await _productImageService.GetAllIQueryable().Where(x => x.ProductId == sourceId).ToListAsync(ct);

                foreach (var doc in docss)
                {
                    if (contentCategory == "FeatureImage")
                    {
                        if (!string.IsNullOrWhiteSpace(doc.Url))
                        {
                            var folder = Path.Combine(_env.WebRootPath,"Content",  "photos",  contentCategory,  sourceId.ToString());
                            var path = Path.Combine(_env.WebRootPath, doc.Url.Replace("/", Path.DirectorySeparatorChar.ToString()));
                            if (File.Exists(path))
                                File.Delete(path);


                        }
                        await _productImageService.DeleteNew(doc.Id);
                        await _productImageService.SaveAsync(ct);
                    }
                    else if (contentCategory == "GalleryImages")
                    {
                        if (!string.IsNullOrWhiteSpace(doc.Url))
                        {
                            var folder = Path.Combine(_env.WebRootPath, "Content", "photos", contentCategory, sourceId.ToString());
                            var path = Path.Combine(_env.WebRootPath, doc.Url.Replace("/", Path.DirectorySeparatorChar.ToString()));
                            if (File.Exists(path))
                                File.Delete(path);                         
                        }
                        await _productImageService.DeleteNew(doc.Id);
                        await _productImageService.SaveAsync(ct);
                    }
                    
                }
                //await _productImageService.SaveAsync(ct);

            }
            else {

                var docs = await _documentsInfoService.GetByDocTypeAndSourceAsync((int)docType, sourceId, ct);
                if (!docs.Any())
                    return;            

                foreach (var doc in docs)
                {
                    if (!string.IsNullOrWhiteSpace(doc.DocName))
                    {
                        // Convert relative path to physical path
                        var filePath = Path.Combine(
                            _env.WebRootPath,
                            doc.DocPath.Replace("/", Path.DirectorySeparatorChar.ToString())
                        );

                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }

                    await _documentsInfoService.Delete(doc.Id);
                }

                await _documentsInfoService.SaveAsync(ct);

            }



        }




        public async Task DeleteSingleGalleryImageAsync(  Guid productId,  string imagePath,  CancellationToken ct)
        {
           
            string normalizedPath = imagePath;          
            if (imagePath.StartsWith("http"))
            {
                var uri = new Uri(imagePath);
                normalizedPath = uri.AbsolutePath; 
            }
       
            normalizedPath = normalizedPath.TrimStart('/');           

            var image = _productImageService.GetAll()
                .FirstOrDefault(x =>
                    x.ProductId == productId &&
                    x.Url == normalizedPath &&
                    !x.IsPrimary);

            if (image == null) return;

            var fullPath = Path.Combine(
                _env.WebRootPath,
                normalizedPath
            );

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            await _productImageService.DeleteNew(image.Id);
            await _productImageService.SaveAsync(ct);
        }




        private static string CleanFileName(string fileName)
        {
            return Path.GetFileName(fileName)
                       .Replace(" ", "_")
                       .Replace("..", "");
        }

    
    }
}
