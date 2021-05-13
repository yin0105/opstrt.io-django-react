import requests
import json
from requests.auth import HTTPBasicAuth
import configparser

# loading configuration file
config = configparser.ConfigParser()
config.read('config.ini')
api_key = config["DEFAULT"]["APCA_API_KEY_ID"]
api_secret = config["DEFAULT"]["APCA_API_SECRET_KEY"]
base_url = config["DEFAULT"]["MAIN_URL"]


user_model = {
  "contact": {
    "email_address": "juan11@example.com",
    "phone_number": "555-666-7788",
    "street_address": ["20 N San Mateo Dr"],
    "city": "San Mateo",
    "state": "CA",
    "postal_code": "94401",
    "country": "USA"
  },
  "identity": {
    "given_name": "juan11",
    "family_name": "Doe",
    "date_of_birth": "1990-01-01",
    "tax_id": "666-55-4321",
    "tax_id_type": "USA_SSN",
    "country_of_citizenship": "USA",
    "country_of_birth": "USA",
    "country_of_tax_residence": "USA",
    "funding_source": ["employment_income"]
  },
  "disclosures": {
    "is_control_person": True,
    "is_affiliated_exchange_or_finra": True,
    "is_politically_exposed": True,
    "immediate_family_exposed": True
  },
  "agreements": [
    {
      "agreement": "margin_agreement",
      "signed_at": "2020-09-11T18:09:33Z",
      "ip_address": "185.13.21.99"
    },
    {
      "agreement": "account_agreement",
      "signed_at": "2020-09-11T18:13:44Z",
      "ip_address": "185.13.21.99"
    },
    {
      "agreement": "customer_agreement",
      "signed_at": "2020-09-11T18:13:44Z",
      "ip_address": "185.13.21.99"
    }
  ],
  "documents": [
    {
      "document_type": "cip_result",
      "content": "VGhlcmUgYXJlIG5vIHdpbGQgYWxwYWNhcy4=",
      "mime_type": "application/pdf"
    },
    {
      "document_type": "identity_verification",
      "document_sub_type": "passport",
      "content": "QWxwYWNhcyBjYW5ub3QgbGl2ZSBhbG9uZS4=",
      "mime_type": "image/jpeg"
    }
  ],
  "trusted_contact": {
    "given_name": "juan11",
    "family_name": "filipe",
    "email_address": "juan11.lover1ss110@gmx.com"
  }
}

def get_accounts():
    url = base_url + '/v1/accounts'
    response = requests.get(url, auth=HTTPBasicAuth(api_key, api_secret))
    #print(response.text)
    return json.loads(response.text)

def order(account_id, symbol, side, qty):
    data = {
        "symbol": symbol,
        "qty": qty,
        "side": side,
        "type": "market",
        "time_in_force": "day",
        "commission": 1
        }
    url = f'{base_url}/v1/trading/accounts/{account_id}/orders'
    response = requests.post(url, auth=HTTPBasicAuth(api_key, api_secret), data=json.dumps(data))
    print(response.text)
    return json.loads(response.text)

def add_account(user_model):
    url = f'{base_url}/v1/accounts'
    response = requests.post(url, auth=HTTPBasicAuth(api_key, api_secret), data=json.dumps(user_model))
    #print(response.text)
    return json.loads(response.text)

def get_ach_relationships(account_id):
    url = f'{base_url}/v1/accounts/{account_id}/ach_relationships'
    response = requests.get(url, auth=HTTPBasicAuth(api_key, api_secret))
    #print(response.text)
    return json.loads(response.text)

def create_ach_relationships(full_name, bank_account_number, bank_routing_number, account_id):
    request_model =  {
      "account_owner_name": full_name,
      "bank_account_type": "CHECKING",
      "bank_account_number": bank_account_number,
      "bank_routing_number": bank_routing_number,
      "nickname": "Bank of America Checking"
    }
    url = f'{base_url}/v1/accounts/{account_id}/ach_relationships'
    response = requests.post(url, auth=HTTPBasicAuth(api_key, api_secret), data=json.dumps(request_model))
    #print(response.text)
    return json.loads(response.text)

def create_transfer(relationship_id, account_id, bank_id, amount):
    data = {
      "relationship_id": relationship_id,
      "transfer_type": "ach",
      "bank_id": bank_id,
      "amount": amount,
      "direction": "INCOMING"
    }
    url = f'{base_url}/v1/accounts/{account_id}/transfers'
    response = requests.post(url, auth=HTTPBasicAuth(api_key, api_secret), data=json.dumps(data))
    #print(response.text)
    return json.loads(response.text)

if __name__ == "__main__":
    # add a account with the specific medel
    #add_account(user_model)

    # get accounts list
    list_accounts = get_accounts()

    # make a order with the specific user account ID
    customer_id = list_accounts[5]['id']
    print(customer_id)
    order(customer_id, 'AAPL', 'buy', 1)

    # create ach relationships
    #create_ach_relationships('Gifted Wright', '24234asdaf44', '22524165523', '67e3a858-539d-4f99-b08f-1149e579274d')

    # get ach relationships
    ach_relationships = get_ach_relationships('67e3a858-539d-4f99-b08f-1149e579274d')
    relationship_id = ach_relationships[0]['id']
    account_id = ach_relationships[0]['account_id']
    bank_account_number = ach_relationships[0]['bank_account_number']
    print(relationship_id)

    # creating a Transfer
    create_transfer(relationship_id, account_id, bank_account_number, "5000")