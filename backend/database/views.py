import json
import requests

from .models import Files
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import get_active_entity, get_active_repository, get_server_status

BLAZEGRAPH_URL = settings.BLAZEGRAPH_URL


def ping(request):
    return JsonResponse({"result": "OK"}, status=200)


@csrf_exempt
def get_files(request):
    files = (
        Files.objects.all()
        .values("name", "graph_id", "size", "id")
        .order_by("-uploaded_at")
    )
    file_list = list(files)
    return JsonResponse({"files": file_list})


@csrf_exempt
def create_database(request):
    if request.method == "POST":
        data = request.POST
        namespace = data.get("namespace")
        headers = {"Content-Type": "text/plain"}
        namespace_config = f"""com.bigdata.namespace.{namespace}.lex.com.bigdata.btree.BTree.branchingFactor=400\n
            com.bigdata.rdf.store.AbstractTripleStore.textIndex=false\n
            com.bigdata.rdf.store.AbstractTripleStore.axiomsClass=com.bigdata.rdf.axioms.NoAxioms\n
            com.bigdata.rdf.sail.isolatableIndices=false\n
            com.bigdata.rdf.sail.truthMaintenance=false\n
            com.bigdata.rdf.store.AbstractTripleStore.justify=false\n
            com.bigdata.rdf.sail.namespace={namespace}\n
            com.bigdata.rdf.store.AbstractTripleStore.quads=false\n
            com.bigdata.namespace.{namespace}.spo.com.bigdata.btree.BTree.branchingFactor=1024\n
            com.bigdata.rdf.store.AbstractTripleStore.geoSpatial=false\n
            com.bigdata.rdf.store.AbstractTripleStore.statementIdentifiers=false"""

        url = f"{BLAZEGRAPH_URL}/namespace"

        response = requests.post(url, headers=headers, data=namespace_config)

        if response.status_code == 201:
            return JsonResponse(
                {"message": "Database has been created", "data": {}}, status=201
            )
        else:
            return JsonResponse({"error": "Failed to create database"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_namespace(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            namespace = data.get("namespace")

            if not namespace:
                return JsonResponse(
                    {"success": False, "error": "Namespace name is required."},
                    status=400,
                )

            # Define headers and data
            headers = {"Content-Type": "text/plain"}
            namespace_config = f"""com.bigdata.namespace.{namespace}.lex.com.bigdata.btree.BTree.branchingFactor=400\n
                com.bigdata.rdf.store.AbstractTripleStore.textIndex=false\n
                com.bigdata.rdf.store.AbstractTripleStore.axiomsClass=com.bigdata.rdf.axioms.NoAxioms\n
                com.bigdata.rdf.sail.isolatableIndices=false\n
                com.bigdata.rdf.sail.truthMaintenance=false\n
                com.bigdata.rdf.store.AbstractTripleStore.justify=false\n
                com.bigdata.rdf.sail.namespace={namespace}\n
                com.bigdata.rdf.store.AbstractTripleStore.quads=false\n
                com.bigdata.namespace.{namespace}.spo.com.bigdata.btree.BTree.branchingFactor=1024\n
                com.bigdata.rdf.store.AbstractTripleStore.geoSpatial=false\n
                com.bigdata.rdf.store.AbstractTripleStore.statementIdentifiers=false"""

            url = f"{BLAZEGRAPH_URL}/namespace"

            response = requests.post(url, headers=headers, data=namespace_config)

            if response.status_code == 201:
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"Namespace '{namespace}' created successfully.",
                        "data": {},
                    },
                    status=201,
                )
            else:
                return JsonResponse(
                    {
                        "success": False,
                        "error": f"Failed to create namespace. Status code: {response.status_code}, response: {response.text}",
                    },
                    status=400,
                )
        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "error": "Invalid JSON payload."}, status=400
            )
        except requests.RequestException as e:
            return JsonResponse(
                {"success": False, "error": f"An error occurred: {str(e)}"}, status=500
            )

    return JsonResponse(
        {"success": False, "error": "Invalid request method."}, status=405
    )


@csrf_exempt
def upload_ttl(request):
    if request.method == "POST":
        graph_id = request.POST.get("graph_id")
        namespace = request.POST.get("namespace")
        ttl_file = request.FILES["file"]
        size = ttl_file.size

        try:
            Files.objects.create(
                name=ttl_file.name,
                graph_id=graph_id,
                size=size,
            )

            headers = {"Content-Type": "text/turtle"}

            sparql_endpoint = f"{BLAZEGRAPH_URL}/namespace/{namespace}/sparql"

            response = requests.post(sparql_endpoint, headers=headers, data=ttl_file.read())
            if response.status_code == 200:
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"File '{ttl_file.name}' uploaded successfully.",
                        "data": {},
                    },
                    status=200,
                )
            else:
                return JsonResponse(
                    {
                        "success": False,
                        "error": f"Failed to upload file. Status code: {response.status_code}",
                    }
                )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": f"An error occurred: {str(e)}"}, status=500
            )
    return JsonResponse(
        {"success": False, "error": "Invalid request method."}, status=405
    )


@csrf_exempt
def connect_database(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ip_address = data.get("ip_address")
            port = data.get("port")
            database_name = data.get("database_name")

            if not ip_address or not port or not database_name:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            url = f"{BLAZEGRAPH_URL}/blazegraph/namespace/{database_name}/sparql"
            response = requests.get(url)

            if response.status_code == 200:
                return JsonResponse(
                    {"success": True, "message": "Connected successfully", "data": {}},
                    status=200,
                )
            else:
                return JsonResponse(
                    {"success": False, "message": "Failed to connect"},
                    status=response.status_code,
                )
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse(
            {"success": False, "error": "Invalid request method"}, status=405
        )


@csrf_exempt
def get_active_database(request):
    if request.method == "GET":
        # try:
        url = f"{BLAZEGRAPH_URL}/namespace"
        response = requests.get(url)
        active_database = get_active_entity(response.text)
        status_url = f"{BLAZEGRAPH_URL}/status?showQueries=details"
        status_response = requests.get(status_url)
        status = get_server_status(status_response.text)
        if active_database:
            return JsonResponse(
                {
                    "success": True,
                    "message": "database found",
                    "data": {"database": active_database, "status": status},
                },
                status=200,
            )
        else:
            return JsonResponse(
                {"success": False, "message": "No active database found", "data": {}},
                status=404,
            )
        # except Exception as e:
        #     return JsonResponse(
        #         {"success": False, "message": "Failed to fetch active database"},
        #         status=500,
        #     )
    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=405
    )


@csrf_exempt
def active_repository(request):
    if request.method == "GET":
        try:
            url = f"{BLAZEGRAPH_URL}/namespace"
            response = requests.get(url)
            active_repository = get_active_repository(response.text)
            if active_repository:
                return JsonResponse(
                    {
                        "success": True,
                        "message": "repository found",
                        "data": active_repository,
                    },
                    status=200,
                )
            else:
                return JsonResponse(
                    {"success": False, "message": "No active repository found"},
                    status=404,
                )
        except Exception as e:
            return JsonResponse(
                {"success": False, "message": "Failed to fetch active repository"},
                status=500,
            )
    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=405
    )
