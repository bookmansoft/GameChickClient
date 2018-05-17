/**
 * 音频管理
 */
class SoundManager{
    /**
     * 音乐文件后缀
     */
    public static Music_Suffix: string = "_mp3";
    /**
     * 战斗背景音乐
     */
    public static get BattleBG_Music(): string {return "diebg_music" + SoundManager.Music_Suffix;}
    /**
     * 按钮音乐
     */
    public static get Button_Music(): string {return "button_music" + SoundManager.Music_Suffix;}
    /**
     * 门音效
     */
    public static get Door_Music(): string{return "door_music" + SoundManager.Music_Suffix;}
    /**
     * 金币音效
     */
    public static get Gold_Music(): string{return "gold_music" + SoundManager.Music_Suffix;}
    /**
     * 背景音乐
     */
    public static get BG_Music(): string{return "bg_music" + SoundManager.Music_Suffix;}
    /**
     * 失败背景乐
     */
    public static get FailBG_Music(): string{return "failbg_music" + SoundManager.Music_Suffix;}

    /**
     * 播放音乐
     * @param name          音乐名字
     * @param count         播放次数（0为循环播放,默认1）
     * @return              返回egret.Sound
     */
    public static PlayMusic(name: string, count: number = 1): egret.Sound{
        // 如果是调试模式则不播放音乐（测试使用）
        if (!Main.IsPlayMusic){
            return null;
        }
        // 判断音效是否不播放
        if (!SoundManager._isPlayYinyue) return null;
        // 确保只有一个背景音乐
        if (name == SoundManager.BattleBG_Music && SoundManager._battleBgSoundC != null) return;
        if (name == SoundManager.BG_Music && SoundManager._bgSoundC != null) return;
        if (name == SoundManager.FailBG_Music && SoundManager._failBgSoundC != null) return;

        var sound: egret.Sound = RES.getRes(name);
        if (sound == null){
            Main.AddDebug("获取音效资源失败：" + name);
            return null;
        }
        // 不是背景音乐的时候直接播放
        if (name != SoundManager.BattleBG_Music && name != SoundManager.BG_Music && name != SoundManager.FailBG_Music){
            sound.play(0, count);
        }
        return sound;
    }

    /**
     * 播放背景音乐
     */
    public static PlayBackgroundMusic(){
        if (!ResReadyMgr.IsReady("startsound")) return;
        SoundManager._isPlayBG = true;
        SoundManager._isPlayDieBG = false;
        SoundManager._isPlayFailBG = false;
        if (SoundManager._battleBgSoundC != null){
            SoundManager._battleBgSoundC.stop();
        }
        if (SoundManager._failBgSoundC != null){
            SoundManager._failBgSoundC.stop();
        }
        if (SoundManager._bgSoundC != null){
            SoundManager._bgSoundC.stop();
        }
        if (SoundManager._bgSound != null){
            SoundManager._bgSoundC = SoundManager._bgSound.play(0, 0);
            SoundManager._bgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
            return;
        }
        var sound: egret.Sound = SoundManager.PlayMusic(SoundManager.BG_Music, 0);
        if (sound != null){
            SoundManager._bgSound = sound;
            SoundManager._bgSoundC = sound.play(0, 0);
            SoundManager._bgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
        }
    }

    /**
     * 播放战斗背景音乐
     */
    public static PlayBattleBGMusic(){
        SoundManager._isPlayBG = false;
        SoundManager._isPlayDieBG = true;
        SoundManager._isPlayFailBG = false;
        if (SoundManager._bgSoundC != null){
            SoundManager._bgSoundC.stop();
        }
        if (SoundManager._failBgSoundC != null){
            SoundManager._failBgSoundC.stop();
        }
        if (SoundManager._battleBgSoundC != null){
            SoundManager._battleBgSoundC.stop();
        }
        if (SoundManager._battleBgSound != null){
            SoundManager._battleBgSoundC = SoundManager._battleBgSound.play(0, 0);
            SoundManager._battleBgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
            return;
        }
        var sound: egret.Sound = SoundManager.PlayMusic(SoundManager.BattleBG_Music, 0);
        if (sound != null){
            SoundManager._battleBgSound = sound;
            SoundManager._battleBgSoundC = sound.play(0, 0);
            SoundManager._battleBgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
        }
    }

    /**
     * 播放失败背景音乐
     */
    public static PlayFailBGMusic(){
        SoundManager._isPlayBG = false;
        SoundManager._isPlayDieBG = false;
        SoundManager._isPlayFailBG = true;
        if (SoundManager._battleBgSoundC != null){
            SoundManager._battleBgSoundC.stop();
        }
        if (SoundManager._failBgSoundC != null){
            SoundManager._failBgSoundC.stop();
        }
        if (SoundManager._bgSoundC != null){
            SoundManager._bgSoundC.stop();
        }
        if (SoundManager._failBgSound != null){
            SoundManager._failBgSoundC = SoundManager._failBgSound.play(0, 0);
            SoundManager._failBgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
            return;
        }
        var sound: egret.Sound = SoundManager.PlayMusic(SoundManager.FailBG_Music, 0);
        if (sound != null){
            SoundManager._failBgSound = sound;
            SoundManager._failBgSoundC = sound.play(0, 0);
            SoundManager._failBgSoundC.volume = SoundManager._isPlayBGYinyue? 1 : 0;
        }
    }

    /**
     * 播放按钮声音
     */
    public static PlayButtonMusic(){
        if (!SoundManager._isPlayYinyue) return;
        if (!ResReadyMgr.IsReady("startsound")) return;
        var sound: egret.Sound = SoundManager.PlayMusic(SoundManager.Button_Music);
    }

    /**
     * 播放基本声音
     */
    public static PlayGoldMusic(){
        if (!SoundManager._isPlayYinyue) return;
        var sound: egret.Sound = SoundManager.PlayMusic(SoundManager.Gold_Music);
    }

    /**
     * 声音是否开启
     */
    public static set YinYue(isPlay: boolean){
        if (SoundManager._isPlayYinyue == isPlay) return;
        SoundManager._isPlayYinyue = isPlay;
        SoundManager._isPlayBGYinyue = isPlay;
        if (SoundManager._bgSoundC != null){
            if (isPlay){
                if (SoundManager._isPlayBG){
                    SoundManager._bgSoundC.volume = 1;
                }
                if (SoundManager._battleBgSoundC != null && SoundManager._isPlayDieBG){
                    SoundManager._battleBgSoundC.volume = 1;
                }
                if (SoundManager._failBgSoundC != null && SoundManager._isPlayFailBG){
                    SoundManager._failBgSoundC.volume = 1;
                }
            }
            else{
                if (SoundManager._isPlayBG){
                    SoundManager._bgSoundC.volume = 0;
                }
                if (SoundManager._battleBgSoundC != null && SoundManager._isPlayDieBG){
                    SoundManager._battleBgSoundC.volume = 0;
                }
                if (SoundManager._failBgSoundC != null && SoundManager._isPlayFailBG){
                    SoundManager._failBgSoundC.volume = 0;
                }
            }
        }
    }

    /**
     * 声音是否开启
     */
    public static get YinYue(): boolean{
        return SoundManager._isPlayYinyue;
    }

    // 变量
    private static _isPlayBG: boolean = false;                  // 是否播放背景音乐
    private static _bgSound: egret.Sound;                       // 背景音乐
    private static _bgSoundC: egret.SoundChannel;               // 背景音乐控制

    private static _isPlayDieBG: boolean = false;               // 是否播放死亡背景音乐
    private static _battleBgSound: egret.Sound;                 // 死亡背景音乐
    private static _battleBgSoundC: egret.SoundChannel;         // 死亡背景音乐控制

    private static _isPlayFailBG: boolean = false;              // 是否在播放失败背景乐
    private static _failBgSound: egret.Sound;                   // 失败背景乐
    private static _failBgSoundC: egret.SoundChannel;           // 失败背景乐管理

    private static _isPlayYinyue: boolean = false;              // 是否播放音
    private static _isPlayBGYinyue: boolean = false;            // 是否播放背景音乐
}