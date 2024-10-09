import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { dataDto } from './data.dto';
import { Response } from 'express';
import { Data } from './data';
import { writeFileSync } from "fs";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  #items: Data[] = [
  ]

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('forms')
  @Render('dataForm')
  getForm(){
    return {
      data: this.#items,
      errors: []
    }
    
  }
  @Post('forms')
  orderPost(@Body() dataDto: dataDto,
    @Res() response: Response) {
      let errors = [];
      
    

    if(!dataDto.name){
      errors.push("Név megadása kötelező!")
    }else if(dataDto.name.trim().length == 0){
      errors.push('Adja meg a nevet! ')
  }
    if(!dataDto.bankNumber){
      errors.push("Bankszámla szám megadása kötelező!")
    }else if(! /^\d{8}-\d{8}$/.test(dataDto.bankNumber)&&! /^\d{8}-\d{8}-\d{8}$/.test(dataDto.bankNumber)){
      errors.push('A bankszámla XXXXXXXX-XXXXXXXX formátumú vagy XXXXXXXX-XXXXXXXX-XXXXXXXX legyen! ')
  }
    if(!dataDto.feltetel){
      errors.push("Felhasználói feltételeket el kell fogadni!")
    }
    
    if(errors.length>0){
      response.render('dataForm',{
        data: dataDto,
        errors
      })
      return;
    }
    const newData: Data = {
      name: dataDto.name,
      bankNumber: dataDto.bankNumber,
      feltetel: true
    }
    this.#items.push(newData);
    const fs = require('fs')

    
      let sor = newData.name + ","+ newData.bankNumber+"\n"
      fs.appendFile('data.csv', sor , (err) => {

        
        if (err) throw err;
    })

    response.redirect('/dataSeccess');
  }
  @Get('dataSeccess')
  openOrderSeccess(){
    return 'Sikeres adatmegadás.'
  }
}
