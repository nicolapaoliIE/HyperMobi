/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * setPrice processor function.
 * @param {org.acme.hypermobi.setPrice} tx the set Price instance
 * @transaction
 */

function setPrice(tx) {

    // Save the old value of the asset.
    var oldPrice = tx.TO.price;

    // Update the asset with the new value.
    tx.TO.price = tx.newPrice;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.hypermobi.Bike')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.TO);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.hypermobi', 'setPriceEvent');
            event.TO = tx.TO;
            event.oldPrice = oldPrice;
            event.newPrice = tx.newPrice;
            emit(event);

        });

}

/**
 * setPrice processor function.
 * @param {org.acme.hypermobi.rentABike} tx the set Price instance
 * @transaction
 */

function rentABike(tx) {
  
  	var totalPrice = tx.miles*tx.TO.price;

    // Save the old value of the asset.
    var oldBalanceBike = tx.TO.balance;
  	var oldBalanceUser = tx.user.balance;

    // Update the asset with the new value.
  	var newBalanceBike = oldBalanceBike+totalPrice;
    var newBalanceUser = oldBalanceUser-totalPrice;
    
    //update balances  
    tx.TO.balance = newBalanceBike;
  	tx.user.balance = newBalanceUser;

    // Get the asset registry for the asset.
  	return getParticipantRegistry('org.acme.hypermobi.User')
  		.then(function (participantRegistry) {
    		return participantRegistry.update(tx.user);
    })
    .then(function () { 
    return getAssetRegistry('org.acme.hypermobi.Bike')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.TO);

        })
        .then(function () {
 

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.hypermobi', 'rentABikeEvent');
            event.TO = tx.TO;
      		event.user = tx.user;
            event.oldBalanceBike = oldBalanceBike;
            event.oldBalanceUser = oldBalanceUser;
      		event.balanceBike = tx.TO.balance;
  		    event.balanceUser = tx.user.balance;
            emit(event);

        });
  })
  

}

/*
transaction rentABike {
 o Double miles
 --> Bike TO
 --> User user
}
  
event rentABikeEvent {
  o Double oldBalanceBike
  o Double oldBalanceUser
  o Double balanceBike
  o Double balanceUser
  --> Bike TO
  --> User user    
}

*/