# UN Visualizations
Project for SAP using D3

## Testing on IE
 * Start > Computer > Map Network Drive (map parallels drive Z:)
 * `cd /d Z:` Windows doesn't change drive without `/d` parameter
 * Navigate to this directory
 * `python -m SimpleHTTPServer <port>` 
 
 Python 2.7.x will host the directory locally for easy IE debugging
 
 Alternatively, use [ngrok](https://www.ngrok.com)  with remoteIE
  * `python -m SimpleHTTPServer <port>` 
  * in another terminal window: `ngrok <port>`