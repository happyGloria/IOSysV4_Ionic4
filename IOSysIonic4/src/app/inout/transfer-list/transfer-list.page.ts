import { Component, OnInit } from '@angular/core';
import { TransferListInfo } from 'src/model/inout/TransferListInfo';
import { BasePage } from 'src/app/base/BasePage';
import { InOutAPI } from 'src/api/InOutAPI';
import { MsgboxUtil } from 'src/helper/MsgboxUtil';
import { ModalController } from '@ionic/angular';
import { DateHelper } from 'src/helper/DateHelper';
import { TransferDetailPage } from '../transfer-detail/transfer-detail.page';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.page.html',
  styleUrls: ['./transfer-list.page.scss'],
})
export class TransferListPage extends BasePage implements OnInit {

  //日期条件
  reqDate: string;
  //列表
  list: Array<TransferListInfo>;

  constructor(
    private inoutAPI: InOutAPI,
    private msgBox: MsgboxUtil,
    private modalCtrl: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.reqDate = DateHelper.format(new Date());

    //初始化
    this.initPage();
  }

  //查询
  async search(showLoader: boolean = true): Promise<Array<TransferListInfo>> {
    //查询列表
    const lstInfo = (await this.inoutAPI.queryTransfer(this.reqDate, showLoader)).lstInfo;
    return lstInfo;
  }

  //初始化
  async initPage() {
    //查询
    this.list = await this.search();
  }

  //刷新
  async doRefresh(event: any) {
    //查询
    this.list = await this.search(false);

    //刷新完成
    event.target.complete();
  }

  //前一天
  toPreDate() {
    let date = DateHelper.parse(this.reqDate);
    date = DateHelper.addDay(date, -1);
    this.reqDate = DateHelper.format(date);

    this.onDateChanged();
  }

  //后一天
  toNextDate() {
    let date = DateHelper.parse(this.reqDate);
    date = DateHelper.addDay(date, 1);
    this.reqDate = DateHelper.format(date);

    this.onDateChanged();
  }

  //日期改变事件
  onDateChanged() {
    if (!this.reqDate) {
      this.reqDate = DateHelper.format(new Date());
    }
    
    this.initPage();
  }

  //打开详细页面
  async openDetail(id: number) {
    //详细页面
    const modal = await this.modalCtrl.create({
      component: TransferDetailPage,
      componentProps: { id: id, date: this.reqDate, isView: false }
    });

    //打开详细页面
    await modal.present();

    //详细页面返回
    const retModal = await modal.onDidDismiss();
    if (retModal.data) {
      this.initPage();
    }
  }

  //删除
  async removeItem(id: number) {
    await this.msgBox.actSheet(
      [
        {
          text: '删除',
          role: 'destructive',
          handler: () => {
            this.inoutAPI.deleteTransfer(id).then(result => {
              if (result.isOK) {
                this.initPage();
              } else {
                this.msgBox.infoDanger(result.msg);
              }
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]);
  }
}
