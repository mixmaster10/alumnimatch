import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Ad, Company } from '../company/company.page';
import { ApiService } from './api.service';
import { CompanyService } from './company.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AdService {

    company: Company = {id: -1, companyName: '', creatorTitle: '', creator_id: -1, companyStartedOn: '', description: '', leadsBalance: -1, paid: true, ads: []}
    constructor(
        private api: ApiService,
        private compServ: CompanyService,
        private dataServ: DataService
    ) {
        this.getCompany()
    }

    getCompany() {
        this.compServ.getUserCompany().then((res) => {
            console.log(res)
            if (res) {
                this.company = res
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    async getAllAds(): Promise<Ad[]> {
        return await new Promise((resolve) => {
            const subs = this.api.get('ads').subscribe((res) => {
                console.log('getAdData', res);
                if (res) {
                    resolve(res)
                }
              }, (err) => {
                console.error(`Can't get Ad Data`, err);
            });
        }) 
    }

    async getRandomAd() {
        if (this.company.id === -1) {
            this.getCompany()
        }
        return this.getAllAds().then(async (res) => {
            if (res.length > 0) {
                const ads = res
                let randomInt = this.getRandomInt(0, ads.length-1)
                let ad = ads[randomInt]
                let ints = []
                ints.push(randomInt)
                //ads.splice(randomInt, 1)
                //let x = 0
                
                while (ads.length > 0) {
                    ads.splice(randomInt, 1)
                    while (ads.length > 0 && this.company.id !== -1 && ad.company_id === this.company.id) {
                        randomInt = this.getRandomInt(0, ads.length-1)
                        while (ints.find((int) => int === randomInt)) {
                            randomInt = this.getRandomInt(0, ads.length)
                        }
                        ad = ads[randomInt] 
                        //x++
                        ints.push(randomInt)
                        ads.splice(randomInt, 1)
                    }
    
                    if (this.company.id === -1 || ad.company_id !== this.company.id) {
                        const adToReturn = await this.compServ.getCompany(ad.company_id).then(async (company) => {
                            //const returnAd = await this.getUserProfile(company.creator_id).then((alumni: any) => {
                                console.log('get company', company);
                                
                                console.log("User logged in", this.dataServ.userInfo)
                                //if (alumni.college === this.dataServ.userInfo.college) {
                                    console.log("Found a random ad to display")
                                    return({ad: ad, sponsor: company})
                                //} else {
                                  //  return null
                                //}
                               
                            //}).catch((err) => {
                                //console.error("Can't get company creator")
                            //})

                            /* console.log("Return Ad", returnAd)

                            if (returnAd) {
                                return returnAd
                            } else {
                                console.log("no return ad")
                                return
                            } */
                            
                        }).catch((err) => {
                            console.error("Ad with no company, ad should be removed - Error: ", err)
                            return "Get company error"
                        })

                        if (adToReturn) {
                            console.log("Returning ad", adToReturn)

                            return adToReturn
                        } else {
                            console.log("adToReturn === null")
                        }
                        
                        randomInt = this.getRandomInt(0, ads.length-1)
                        while (ints.find((int) => int === randomInt)) {
                            randomInt = this.getRandomInt(0, ads.length)
                        }
                        ad = ads[randomInt] 
                        //x++
                        ints.push(randomInt)
                        //ads.splice(randomInt, 1)
                    }

                }  
                console.error("No ads available for this network")
                return "No Ads for this network"
            } else {
                console.log("No ads in database")
                return "No ads"
            }
        }).catch(err => {
            console.error(`Can't get Ad Data`, err);
        })
                
    }

    async getUserProfile(uid) {
        return await new Promise((resolve, reject) => {

            this.api.get(`alumni/detail/${uid}`).subscribe((res: any) => {
              console.log('getUserProfile', res);
              resolve(res.alumni)
              //this.user = res.alumni;
              //this.friends = res.friends;
              //this.ps = res.ps;
              //this.cl = res.cl;
            }, (err) => {
                console.error("Getting company creator error: ", err)
                reject(err)
            });
        })
      }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }

}
