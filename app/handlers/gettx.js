const validator = require('validator');
const BigNumber = require('bignumber.js');

const utils = require('./utils/utils.js');
const feeutils = require('./utils/fee.js');

const Const = require('../const');
const logger = require('../common/logger');
const nothrow = require('../common/nothrow');

const tokens = require("../../config/tokens");

module.exports = async function(client, req, callback) {
   const rule = [
        {
            name: 'txid',
            value: null,
            is_valid: function(txid) {
                if (txid.length !== 64 ){
                    return false;
                }
                this.value = txid;
                return true;
            }
        }
    ];

    if (!utils.validationParams(req, rule, callback)) {
        return;
    }

    try {
        let tx = await client.getTransaction(rule[0].value);
        if (tx.hex.search(Const.OmniSimpleSendHeader) > 0) {
            try {
                tx.omnidata = await this._client.omni_gettransaction(txid);
            } catch (error) {
            }
        }
        callback(undefined, tx);
    } catch (error) {
        callback({code: -32000, message: error.message}, undefined);
    }
}
