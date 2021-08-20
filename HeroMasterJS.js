/**
 * 
 * @title HeroMasterJS.js
 * @description Welcome HeroMasterJS! HeroMasterJS is a JS class that enhances the app.cryptohero.io UX experience while also offering an edge to battle
 * 
 * @ver 1.1.1
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var HeroMasterJS = {
    
    scriptsLoaded : false,
	balances : {},
	marketPrices : {},
	currentFeeScope : "today",
	intervals : {},
	listeners : {},

	init : function() {
		
		this.loadMetaMaskListeners();
		this.loadHeader();
		this.loadWeb3();
		
		setTimeout(function(dm) {
			if (!window.ethereum.selectedAddress) {
				return true;
			}
			dm.loadPrices();
		} , 600 , this );
		
		this.intervals.listeners = setInterval(function( dm ) {
			dm.loadListeners();
		}, 500 , this )
		
	}
	
	,
	
	destroyCurrentInstance : function() {
		
		/* remove header */
		document.querySelector('.HeroMasterJS').parentNode.removeChild(document.querySelector('.HeroMasterJS'));
			
		/* destroy all current intervals */
		for (key in HeroMasterJS.intervals) {
			clearInterval(HeroMasterJS.intervals[key])
		}
		
		/* set select HeroMasterJS data back to default */
		this.balances = {}
		this.marketPrices = {}
		this.currentFeeScope = "today"
		this.intervals = {}
		this.listeners = {}
		
	}
	
	,
	
	loadMetaMaskListeners : function() {
		
		/* on acount change */
		window.ethereum.on('accountsChanged', function (accounts) {

			
			/* Destroy BladeMaserJS instance */
			HeroMasterJS.destroyCurrentInstance()
			
			/* Rebuild HeroMasterJS instance */
			setTimeout(function() {
				HeroMasterJS.init();
			}, 1000 )
			
		})
	}
	
	,
	
	loadListeners : function() {
		
		/**
		 *Listen for BNB tip 
		 */
		if (document.querySelector('.bnb-tip') && !HeroMasterJS.listeners.bnbTip) {
			
			HeroMasterJS.listeners.bnbTip = true;
			
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
				HeroMasterJS.listeners.bnbTip = true;
				
				var transactionHash = window.ethereum.request({
				    method: 'eth_sendTransaction',
				    params: [
				      {
				        to: '0xd82E6F12C32a9584FBAcE2CF48F916646ff8139c',
				        from: window.ethereum.selectedAddress,
				        value: Web3.utils.toHex(Web3.utils.toWei("0.01")),
				      },
				    ],
				  });
			} , {once :true} )
		}
		
		/**
		 * Listen for hero tip (not active at the moment)
		 */ 
		if (document.querySelector('.hero-tip') && !HeroMasterJS.listeners.heroTip) {

			HeroMasterJS.listeners.heroTip = true;
				
			/* listen for TIP hero event */
			document.querySelector('.hero-tip').addEventListener('click', function() {
				
			})
			
		}
		
		/**
		 * Listen for fee range cycle clicks 
		 */
		if (document.querySelector('.nav-item')  && !HeroMasterJS.listeners.navClick) {
			
			HeroMasterJS.listeners.navClick = true;
			
			document.querySelector('.nav-item').addEventListener('click', function() {
				console.log("nav item clicked")
			})
		}
		
		
		/**
		 * Listen for fee range cycle clicks 
		 */
		if (document.querySelector('.cycle-fee-scope-forward')  && !HeroMasterJS.listeners.feeScopeForward) {
			
			
			HeroMasterJS.listeners.feeScopeForward = true;
			
			/* listen for TIP hero event */
			document.querySelector('.cycle-fee-scope-forward').addEventListener('click', function() {
				
				document.querySelectorAll(".fee-bnb").forEach( function(feeContainer) {
					feeContainer.style.display = "none";
				})
						
				switch(HeroMasterJS.currentFeeScope) {
					case "today":
						HeroMasterJS.currentFeeScope = "week";
						break;
					case "week":
						HeroMasterJS.currentFeeScope = "month";
						break;
					case "month":
						HeroMasterJS.currentFeeScope = "today";
						break;	
				}
				
				
				document.querySelector("#fee-bnb-contatiner-" + HeroMasterJS.currentFeeScope ).style.display = "inline-block";
			
			} )
		}
		
	}
	
	,
	
	loadWeb3 : function() {
		
		if (this.scriptsLoaded) {
			return;
		}
		
		var jq = document.createElement('script');
	    jq.type = 'text/javascript';
	    jq.async = true;
	    jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.5.0/web3.min.js';
	    var s = document.body.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(jq, s);
	    
	    this.scriptsLoaded = true;
	}
	
	,

	loadHeader : function() {
		
		if (document.querySelector('.HeroMasterJS')) {
			return;
		}
		

		var headerElement= document.createElement('div');
		
		var htmlTemplate = ''
		+ '<div class="HeroMasterJS" style="background-color: #000; color:#fff;display:flex;justify-content:space-between;flex-wrap: wrap;font-family:system-ui;text-align: end;padding-right:26px;position:fixed; width:100vw;z-index:100;padding-left:2px;padding-top:4px;padding-bottom:2px; font-size:13px;">'
	
		+ '<div class="bm-col-1" style="padding-top: 5px;padding-left:5px;">'
		+ '		<b>HeroMasterJS</b> '
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$BNB</b> <span class="bnb-price" title="Market price of BNB in USD"></span>  <span class="bnb-balance" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$hero</b> <span class="hero-price" title="Market price of hero in USD"></span>'
		
		+ '	</div>'
		
		+ ' <div  class="bm-col-2">'
		
		+ '		<div class="hero-ballance-container" style="display:inline-block;">'
		+ '			<b>hero</b>:  <span class="hero-balance-hero" style="color:gold"></span>  <span class="hero-balance-usd" style="color:lightgreen"></span>  <span class="hero-balance-bnb" style="color:lightgreen"></span>'
		+ '			<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		

		+ '		<div class="bnb-ballance-container" style="display:inline-block;">'
		+ '			<b>BNB</b>:  <span class="bnb-balance-bnb" style="color:lightblue"></span>  <span class="bnb-balance-usd" style="color:lightgreen"></span>  <span class="bnb-balance-hero" style="color:lightgreen"></span>'
		
		+ '			<span class="header-separator"  style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		
		
		+ '		<div class="fees-container" style="display:inline-block;">'
		+ '			<b>FEES</b>:  '
		
		//+ '		<span class="cycle-fee-scope-back" style=""><img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="width:25px;transform: scaleX(-1);margin-left: 10px;    margin-right: -3px;    margin-left: 2px;"></span>'
		
		+ ' 		<span class="fee-label fee-bnb" id="fee-bnb-contatiner-today" style="color:mintcream;"><span class="fee-bnb-today" style="color:lightblue"></span><span class="fee-usd-today" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 24 HOURS</span> </span>'
		
		+ '     	<span class="fee-labe fee-bnb" id="fee-bnb-contatiner-week" style="color:mintcream;display:none;"><span class="fee-bnb-week" style="color:lightblue"></span><span class="fee-usd-week" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 7 DAYS</span> </span>'
		
		+ '     	<span class="fee-label fee-bnb" id="fee-bnb-contatiner-month" style="color:mintcream;display:none"><span class="fee-bnb-month" style="color:lightblue"></span><span class="fee-usd-month" style="color:LIGHTSALMON"></span><span style="font-size: 10px;margin-left: 3px;"> LAST 31 DAYS</span> </span> '
		
		+ '		<span class="cycle-fee-scope-forward" style="cursor:pointer;font-size: 19px;vertical-align: middle;"> ➞ </span>'
		
		+ '     <span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-tip-container" style="display:none;">'
		+ '     <a class="bnb-tip"  href="#tip-HeroMasterJS-dev"  title="Send a Tip to the HeroMasterJS Developemnt Team!"><b>TIP <span class="recommended-bnb-tip">.01</span> BNB</b></a>'
		+ '		</div>'
		
		+ '		<div class="bnb-free-trial-counter" style="display:none;" title="Days remaining in the free BladeMasterJS trial.">'
		+ '     <b> <span class="dono-days-remaining"></span></b>'
		+ '		</div>'
		
		+ '</div>'
		+ '</div>'
		+ ' '
		+ '<style>.header-separator {margin:7px;}</style>'
		
		headerElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
	}
	
	,
	
	
	loadPrices : function() {
		
		if (this.marketPrices.bnb ) {
			return;
		}

		
		/* load BNB and hero prices from Coingecko API */
		var coingeckoRequest = new XMLHttpRequest();
			
		var params = {
            vs_currency: "usd",
            ids: "binancecoin,step-hero"
        }
        
        var apiURL = new URL("https://api.coingecko.com/api/v3/coins/markets");
        
        for (const key in params ) {
        	apiURL.searchParams.append(key , params[key]);
        }
        
                
		coingeckoRequest.open("GET", apiURL.href );
		coingeckoRequest.send();
		
		coingeckoRequest.onload = () => {
	
			var responseJSON  = JSON.parse(coingeckoRequest.response);

			HeroMasterJS.marketPrices.bnb = responseJSON[0].current_price;
			HeroMasterJS.marketPrices.hero = responseJSON[1].current_price;
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + HeroMasterJS.marketPrices.bnb +" "
			document.querySelector('.hero-price').innerText = "" + HeroMasterJS.marketPrices.hero + " "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
		var params = {
	            ethAddress: window.ethereum.selectedAddress.toLowerCase(),
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	            product: "heromasterjs",
	            query: ["tokenBalance","bnbBalance","txFees"]
	        }
	        
	        apiURL = new URL("https://phoenixtools.io/api/gamestats/");
	        
	        for (const key in params ) {
	        	apiURL.searchParams.append(key , params[key]);
	        }
	        
	                
			bscscanRequest.open("GET", apiURL.href );
			bscscanRequest.send();
			
			bscscanRequest.onload = () => {
		
				var responseJSON  = JSON.parse(bscscanRequest.response);
				
				if (!responseJSON.dono.isDono && !responseJSON.isWhiteListed && responseJSON.trial.status != "active") {
					
					document.querySelector('.HeroMasterJS').style.justifyContent = "flex-end";
					document.querySelector('.bm-col-1').style.width = "90%";
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
					
					document.querySelector('.bm-col-1').innerHTML = '<div class="dono-activate-promot" style="display: contents;padding-right:10px;width:100%;"><marquee>YOOOOO! <b>HeroMasterJS</b> costs <span style="color:gold"><b>.01 BNB</b></span> for every <b>40 days</b> of use. --------  Click the <b>TIP</b> button to the right to activate your copy!  --------  Make sure your <b>MetaMask</b> is set to the <b>Binance Smart Chain</b> before tipping!  -------- There might be a delay between tipping and asset activation depending on the speed of the bscscan.com API. If activation takes longer than an hour then please reach out on our <a href="https://discord.gg/6AjVj3s9aN" target="_blank">Discord</a> for manual assistance :) </marquee></div>';
					document.querySelector('.hero-ballance-container').parentNode.removeChild(document.querySelector('.hero-ballance-container'))
					document.querySelector('.bnb-ballance-container').parentNode.removeChild(document.querySelector('.bnb-ballance-container'))
					document.querySelector('.fees-container').parentNode.removeChild(document.querySelector('.fees-container'))
					return;
				} 
				else if (responseJSON.dono.isDono || responseJSON.isWhiteListed) {
					document.querySelector('.bnb-tip').title = "You have " + responseJSON.dono.daysRemaining + " days until the next donation.";
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
				}	
				else if (responseJSON.trial.status == "active") {
					document.querySelector('.bnb-free-trial-counter').style.display = "inline-block";
					document.querySelector('.dono-days-remaining').innerText = responseJSON.trial.daysRemaining + " Days ";
				}
				
				
				/* get user hero balance, does not include staked hero */
				HeroMasterJS.balances.hero = parseFloat(responseJSON.balances.token.inETH).toFixed(2);
				HeroMasterJS.balances.bnb = parseFloat(responseJSON.balances.bnb.inETH).toFixed(3);
				
				/* figure out dollar balance */
				HeroMasterJS.balances.usd_bnb =  ( parseFloat(HeroMasterJS.balances.bnb , 8 ) * parseFloat(HeroMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				HeroMasterJS.balances.hero_bnb =  ( parseFloat(HeroMasterJS.balances.usd_bnb , 8 ) / parseFloat(HeroMasterJS.marketPrices.hero , 8 ) ).toFixed(2);
				
				
						
				/* figure out hero balance */
				HeroMasterJS.balances.usd_hero =  ( parseFloat(HeroMasterJS.balances.hero , 8 ) * parseFloat(HeroMasterJS.marketPrices.hero , 8 ) ).toFixed(2);
				HeroMasterJS.balances.bnb_hero =  ( parseFloat(HeroMasterJS.balances.usd_hero , 8 ) / parseFloat(HeroMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
			
				
				/* set these prices into the header */
				document.querySelector('.hero-balance-hero').innerText =  HeroMasterJS.balances.hero + " HERO  "
				document.querySelector('.hero-balance-usd').innerText = " +$" + HeroMasterJS.balances.usd_hero + " "
				document.querySelector('.hero-balance-bnb').innerText = " +" + HeroMasterJS.balances.bnb_hero + "BNB "
				document.querySelector('.bnb-balance-bnb').innerText =  HeroMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = " +$" + HeroMasterJS.balances.usd_bnb + " "
				document.querySelector('.bnb-balance-hero').innerText = " +" + HeroMasterJS.balances.hero_bnb + " HERO "
				
				/* calculate fee bnb cost in USD */
				var feesTodayUSD = responseJSON.txFees.today * HeroMasterJS.marketPrices.bnb;
				var feesWeekUSD = responseJSON.txFees.thisWeek * HeroMasterJS.marketPrices.bnb;
				var feesMonthUSD = responseJSON.txFees.thisMonth * HeroMasterJS.marketPrices.bnb;
				
				/* add day fees to UI */
				document.querySelector('.fee-bnb-today').innerText = parseFloat(responseJSON.txFees.today).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-today').innerText = " ($"+ parseFloat(feesTodayUSD).toFixed(3) + ") "
				
				/* add week fees to UI */
				document.querySelector('.fee-bnb-week').innerText =  parseFloat(responseJSON.txFees.thisWeek).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-week').innerText =  " ($"+ parseFloat(feesWeekUSD).toFixed(3) + ") "
				
				/* add month fees to UI */
				document.querySelector('.fee-bnb-month').innerText =  parseFloat(responseJSON.txFees.thisMonth).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-month').innerText =   " ($"+ parseFloat(feesMonthUSD).toFixed(3) + ") "
			};
		
		};

	}
	
}

setTimeout(function() {
	
	setInterval(function() {
		//document.querySelector('.z-header').style = "background-color:#000 !important;"
		document.querySelector('.container').style = "max-width:100%;padding:0px;"
		document.querySelector('nav').style = "top:33px;"
	} , 500 )
	HeroMasterJS.init();
	
} , 1500 )