import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestService } from '../../app/rest.service';
import { IBlockchain } from '../../models/blockchain';

// Component for displaying the updated data from the blockchain

@IonicPage()
@Component({
  providers: [RestService],
  selector: 'page-blockchain',
  templateUrl: 'blockchain.html',
})
export class BlockchainPage {

  private blockchain: IBlockchain;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService) {
  }

  // Loads the Blockchain data
  private ngOnInit() {
    this.restService.getBlockchain()
      .subscribe((data) => {
        this.blockchain = data;
        this.blockchain.time = new Date(this.blockchain.time).toLocaleString();
      },
      // Error Handling
      (error) => {
        console.log('Error :' + error);
      },
    );
  }

}
