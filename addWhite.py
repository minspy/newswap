from email.mime import application
import tornado.ioloop
import tornado.web
from web3 import Web3
import re
import urllib.request

config = {
    '56': { # BSCMAIN
        'pre_url': 'https://bscscan.com/address/{}',
        'factory_address': '',
        'setter_address': '',
        'setter_private_key': '',
        'WETH': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        'gas_price': 5,
        'node_url': ""
    },
    '97': { # BSCTEST
        'pre_url': 'https://testnet.bscscan.com/address/{}',
        'factory_address': '0x77E94380108309648eCe17fb150f93f8Fcca23c0',
        'setter_address': '0x994D95Ea4C37C4b586Fa9668211Daa4Aa03be060',
        'setter_private_key': '0x2a5f70d22e1ee3c94e8bdc4846c41d7f92b588cc1bafa8f96d68d0a3533d926c',
        'WETH': '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        'gas_price': 10,
        'node_url': 'https://data-seed-prebsc-1-s3.binance.org:8545'
    }
}

factory_abi = [{"constant":True,"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"creater","type":"address"}],"name":"isWhite","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"creater","type":"address"},{"internalType":"uint256","name":"flag","type":"uint256"}],"name":"addWhiteList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"}]

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        # 获取代币的创建者地址
        chain_id = self.get_argument('chainId')
        token = Web3.toChecksumAddress(self.get_argument('token'))
        if token == Web3.toChecksumAddress(config[chain_id]['WETH']):
            return
        url = config[chain_id]['pre_url'].format(token)
        # headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'}
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url=url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8') #读取源代码并转为unicode
#        print(html)
        # <a href="/address/0x8c2c76702538dfcc3b7baa3f0c01f4f354adf75b" class="hash-tag text-truncate keychainify-checked" data-toggle="tooltip" title="" data-original-title="Creator Address">0x8c2c76702538dfcc3b7baa3f0c01f4f354adf75b</a>
        pattern = r"Creator Address'>(.*?)<"
        search_result = re.search(pattern, html, flags=0)
        creator_address = Web3.toChecksumAddress(search_result.group(1))

        # 创建工厂合约
        provider = Web3.HTTPProvider(config[chain_id]['node_url'])
        web3 = Web3(provider)
        factory_address = Web3.toChecksumAddress(config[chain_id]['factory_address'])
        factory_contract = web3.eth.contract(address=factory_address, abi=factory_abi)

        # 判断代币的创建者是否已经在白名单中
        flag = factory_contract.functions.isWhite(token, creator_address).call()
        print(flag)
        if flag > 0:
            return

        # 如果创建者不在白名单中，则将代币的创建人添加到factory合约的白名单中
        setter_address = Web3.toChecksumAddress(config[chain_id]['setter_address'])
        tx = factory_contract.functions.addWhiteList(token, creator_address, 1).buildTransaction({
            'from': setter_address,
            'value': 0,
            'gas': 1000000,
            'gasPrice': Web3.toWei(config[chain_id]['gas_price'], 'gwei'),
            'nonce': web3.eth.getTransactionCount(setter_address)
        })
        singed_tx = web3.eth.account.sign_transaction(tx, config[chain_id]['setter_private_key'])
        tx_hash = web3.eth.send_raw_transaction(singed_tx.rawTransaction)
        print(Web3.toHex(tx_hash))
        self.write(Web3.toHex(tx_hash))


application = tornado.web.Application([(r"/addWhite", MainHandler), ])
application.listen(8868)
tornado.ioloop.IOLoop.instance().start()

# localhost:8868/addWhite?chainId=97&token=0xa8c9da5b1c52dd23997b6b27ff60c19e3f947681
# localhost:8868/addWhite?chainId=56&token=0x5cd149a8e33b31bff20bd7d49a8159d42e6bd419
# sudo ufw status
# sudo ufw allow 8868
# sudo ufw enable
# sudo ufw reload