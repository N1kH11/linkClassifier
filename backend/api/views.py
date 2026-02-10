import json
import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def preview_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            url = data.get('url')
            
            if not url:
                return JsonResponse({'error': 'URL is required'}, status=400)
            
            # Add basic headers to mimic a browser
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract OG tags
            title = soup.find('meta', property='og:title')
            description = soup.find('meta', property='og:description')
            image = soup.find('meta', property='og:image')
            
            # Fallback if OG tags are missing
            if not title:
                title = soup.find('title')
            
            if not description:
                description = soup.find('meta', attrs={'name': 'description'})
            
            result = {
                'title': title['content'] if title and title.has_attr('content') else (title.text if title else ''),
                'description': description['content'] if description and description.has_attr('content') else '',
                'image': image['content'] if image and image.has_attr('content') else ''
            }
            
            return JsonResponse(result)
            
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
