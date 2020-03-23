from pyroutelib3 import Router
import asyncio
from aiohttp import web
import json
from concurrent.futures import ThreadPoolExecutor

# Initialise it
router = Router("car", localfile="./data/ahmedabad.pbf", localfileType="pbf")
loop = asyncio.get_event_loop()


def caculateRoute(start, end):
    # Find the route - a list of OSM nodes
    status, route = router.doRoute(start, end)

    if status == 'success':
        return list(map(router.nodeLatLon, route))
    return []


async def findRoute(request):
    src_lat = float(request.match_info['src_lat'])
    src_lng = float(request.match_info['src_lng'])

    dest_lat = float(request.match_info['dest_lat'])
    dest_lng = float(request.match_info['dest_lng'])

    start = router.findNode(src_lat, src_lng)
    end = router.findNode(dest_lat, dest_lng)

    with ThreadPoolExecutor() as pool:
        response = await loop.run_in_executor(pool, caculateRoute, start, end)
    return web.Response(text=json.dumps(response))


async def index(request):
    return web.FileResponse('./frontend/index.html')

app = web.Application()
app.add_routes(
    [
        web.get('/route/{src_lat},{src_lng},{dest_lat},{dest_lng}', findRoute),
    ]
)

app.router.add_static('/', './frontend', show_index=True)
web.run_app(app)
