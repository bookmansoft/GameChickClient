/**
 * 皮肤创建管理 
 */
class SkinCreateMgr{
    /**
     * 创建选中框皮肤
     */
    public static CreateCheckBox(up: string, down: string, disabled: string = ""): any{
        var text: string =
        '<?xml version="1.0" encoding="utf-8"?><e:Skin class="skins.CheckBoxSkin" states="up,down,disabled,upAndSelected,downAndSelected,disabledAndSelected" xmlns:e="http://ns.egret.com/eui">    <e:Group width="100%" height="100%">        <e:layout>            <e:HorizontalLayout verticalAlign="middle"/>        </e:layout>' + 
        '<e:Image fillMode="scale" alpha="1" alpha.disabled="1" alpha.down="1"' +
        ' source="' + up + '"' + 
        ' source.down="' + up + '"' + 
        ' source.upAndSelected="' + down + '"' + 
        ' source.downAndSelected="' + down + '"' + 
        ' source.disabled="' + disabled + '"' + 
        ' source.disabledAndSelected="' + disabled + '"' + '/>' +
        '<e:Label id="labelDisplay" size="20" textColor="0x707070"                 textAlign="center" verticalAlign="middle"                 fontFamily="Tahoma"/>   </e:Group></e:Skin>'
        var xml = EXML.parse(text);
        return xml;
    }

    /**
     * 创建单选框皮肤
     */
    public static CreateRadioButton(up: string, down: string, disabled: string = ""): any{
        var text: string =
        '<?xml version="1.0" encoding="utf-8"?><e:Skin class="skins.RadioButtonSkin" states="up,down,disabled,upAndSelected,downAndSelected,disabledAndSelected" xmlns:e="http://ns.egret.com/eui">    <e:Group width="100%" height="100%">        <e:layout>            <e:HorizontalLayout verticalAlign="middle"/>        </e:layout>' + 
        '<e:Image fillMode="scale" alpha="1" alpha.disabled="1" alpha.down="1"' +
        ' source="' + down + '"' + 
        ' source.down="' + down + '"' + 
        ' source.upAndSelected="' + up + '"' + 
        ' source.downAndSelected="' + up + '"' + 
        ' source.disabled="' + disabled + '"' + 
        ' source.disabledAndSelected="' + disabled + '"' + '/>' +
        '<e:Label id="labelDisplay" size="20" textColor="0x707070"                 textAlign="center" verticalAlign="middle"                 fontFamily="Tahoma"/>   </e:Group></e:Skin>'
        var xml = EXML.parse(text);
        return xml;
    }

    /**
     * 创建按钮皮肤
     */
    public static CreateButton(up: string, down: string, disabled: string = ""): any{
        var text: string = 
        '<?xml version="1.0" encoding="utf-8" ?>'+
        '<e:Skin class="skins.ButtonSkin" states="up,down,disabled" minHeight="50" minWidth="100" xmlns:e="http://ns.egret.com/eui"> '+
        ' <e:Image width="100%" height="100%" scale9Grid="1,3,8,8" alpha.disabled="1"' + 
        ' source.up="' + up + '"' +
        ' source.down="' + down + '"' +
        ' source.disabled="' + disabled + '"/>' +
        ' <e:Label id="labelDisplay" top="8" bottom="8" left="8" right="8" size="20" textColor="0xFFFFFF" verticalAlign="middle" textAlign="center"/>'+
        ' <e:Image id="iconDisplay" horizontalCenter="0" verticalCenter="0"/>'+
        '</e:Skin>';
        var xml = EXML.parse(text);
        return xml;
    }
}