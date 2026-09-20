using System.Text;
using System.Text.RegularExpressions;

public static class SlugHelper
{
    public static string Generate(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        text = text.ToLowerInvariant().Trim();

        // Remove special characters
        text = Regex.Replace(text, @"[^a-z0-9\s-]", "");

        // Replace multiple spaces with single dash
        text = Regex.Replace(text, @"\s+", "-");

        // Remove multiple dashes
        text = Regex.Replace(text, @"-+", "-");

        return text.Trim('-');
    }
}
