"ui";

importClass(com.alipay.sdk.app.PayTask);

ui.layout(
    <vertical padding="16">
        <text text="支付宝应用支付" textSize="22sp" />
        <input
            id="orderInfo"
            marginTop="12"
            hint="粘贴服务端返回的完整 orderInfo"
            inputType="textMultiLine"
            minLines="6"
            gravity="top"
        />
        <button id="pay" text="拉起支付宝" />
        <text id="result" marginTop="12" textIsSelectable="true" />
    </vertical>
);

ui.pay.on("click", function () {
    var orderInfo = String(ui.orderInfo.text()).trim();
    if (!orderInfo) {
        toast("请先填写完整的 orderInfo");
        return;
    }

    // PayTask 要求真实 Activity，因此在线程启动前保存当前 UI Activity。
    var currentActivity = activity;
    ui.pay.setEnabled(false);
    ui.result.setText("正在拉起支付宝…");

    threads.start(function () {
        try {
            var result = new PayTask(currentActivity).payV2(orderInfo, true);
            var resultStatus = String(result.get("resultStatus"));
            var memo = String(result.get("memo"));
            var resultContent = String(result.get("result"));

            ui.run(function () {
                ui.pay.setEnabled(true);
                ui.result.setText(
                    "resultStatus: " + resultStatus
                    + "\nmemo: " + memo
                    + "\nresult: " + resultContent
                    + "\n\n客户端状态不能代替服务端订单确认。"
                );
            });
        } catch (error) {
            ui.run(function () {
                ui.pay.setEnabled(true);
                ui.result.setText("调用失败：" + error);
            });
        }
    });
});
