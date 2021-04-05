import { Injectable } from '@angular/core';
import { resolve } from 'url';
import { Ad, Company } from '../company/company.page';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    //allAds: Ad[];
    company: Company = {id: -1, companyName: '', creatorTitle: '', creator_id: -1, companyStartedOn: '', description: '', leadsBalance: -1, paid: true, ads: []}
    constructor(
        private api: ApiService
    ) {
        //this.api.get('user/company')
        //this.getUserCompany()
    }

    async getUserCompany(): Promise<Company> {
        return await new Promise((resolve, reject) => {
            this.api.get('user/company').subscribe((res: any) => {
              console.log('getCompanyData', res);
              if (res) {
                this.company = res[0]
                resolve(res[0])
              } else {
                reject("No company")
              }
            }, (err) => {
              console.error('Company Data: ', err);
              reject(err)
            });
        })
      }

    async getCompany(id: number): Promise<Company> {
        return await new Promise((resolve) => {
            this.api.get(`company/${id}`).subscribe((res: any) => {
                console.log('get company', res)
                if (res) {
                    resolve(res)
                }
            }, (err) => {
                console.error('Companies Data Error: ', err);
            });
        })
    }

    async getAllCompanies(): Promise<Company[]> {
      return await new Promise((resolve) => {
        this.api.get(`company`).subscribe((res: any) => {
          console.log('get all companies', res)
          if (res){
            resolve(res)
          }
        }, (err) => {
          console.error(`Companies Data Error: `, err)
        })
      })
    }

}
