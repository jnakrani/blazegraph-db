from bs4 import BeautifulSoup as bs


def get_active_entity(response:str):
    soup = bs(response, features="lxml")
    result = {}
    for dec in soup.find("rdf:rdf").find_all("rdf:description"):
        result["database_id"] = dec.get("rdf:nodeid")
        result["title"] = dec.find("title").text.strip()
        result["name_space"] = dec.find("namespace").text.strip()
        result["sparql_endpoint"] = dec.find("sparqlendpoint").get("rdf:resource")
        break
    return result


def get_active_repository(response:str):
    soup = bs(response, features="lxml")
    result = []
    for dec in soup.find("rdf:rdf").find_all("rdf:description"):
        result.append(
            {
                "repository_id": dec.get("rdf:nodeid"),
                "title": dec.find("title").text.strip(),
                "sparql_endpoint": dec.find("sparqlendpoint").get("rdf:resource"),
            }
        )
    return result


def get_server_status(response: str):
    soup = bs(response, features="html")
    result = {}
    query = soup.find("p", {"id": "counter-set"}).text

    print("Query :::", query.split("\n"))
    result = {i.split("=")[0].split("/")[-1] : i.split("=")[1] for i in query.split("\n")[1:]}
    result["acceptedQueryCount"] = soup.find("span", {"id": "accepted-query-count"}).text.strip()
    result["runningQueryCount"] = soup.find("span", {"id": "running-query-count"}).text.strip()
    
    return result