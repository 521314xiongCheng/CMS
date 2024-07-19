'use strict'

const uuidv4 = require('uuid/v4')
const dateFns = require('date-fns')
const { parseString } = require('xml2js')
const zlib = require('zlib')

exports.createAuthUrl = (relayState, idpKey, issuerValue, realmURL, cb) => {
  const id = uuidv4()
  const authnRequestSamlp = 'urn:oasis:names:tc:SAML:2.0:protocol'
  const protocolBinding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
  const issuerSamlp = 'urn:oasis:names:tc:SAML:2.0:assertion'
  const version = '2.0'
  const forceAuth = 'false'
  const isPassive = 'false'
  const dateTime = new Date()
  const issueInstant = dateFns.format(dateTime, 'YYYY-MM-DD') + 'T' + dateFns.format(dateTime, 'HH:mm:ss') + 'Z'
  const xml = `<?xml version="1.0" encoding="utf-8"?><samlp:AuthnRequest xmlns:samlp="${authnRequestSamlp}" AssertionConsumerServiceURL="${relayState}" ForceAuthn="${forceAuth}" ID="id${id}" IsPassive="${isPassive}" IssueInstant="${issueInstant}" ProtocolBinding="${protocolBinding}" Version="${version}"><samlp:Issuer xmlns:samlp="${issuerSamlp}">${issuerValue}</samlp:Issuer></samlp:AuthnRequest>`

  zlib.deflateRaw(new Buffer(xml), (err, buffer) => {
    if (!err) {
      const SAMLRequest = buffer.toString('base64')
      const url = realmURL + '?SAMLRequest=' + encodeURIComponent(SAMLRequest) + '&RelayState=' + relayState + '&idpKey=' + idpKey
      cb && cb(url)
    } else {
      console.log(err)
      cb && cb(null, err.message)
    }
  })
}

exports.readSamlResponse = (response, cb) => {
  const buffer = Buffer.from(response, 'base64')
  const xml = buffer.toString('utf-8')
  parseString(xml, (err, result) => {
    if (err) {
      cb && cb(err.message)
    } else {
      const attrs = result['samlp:Response']['Assertion'][0]['AttributeStatement'][0]['Attribute']
      console.log(JSON.stringify(attrs))
      attrs.forEach(item => {
        if (item.$.Name === 'Email') {
          cb && cb(item['AttributeValue'][0])
        }
      })
    }
  })
}
