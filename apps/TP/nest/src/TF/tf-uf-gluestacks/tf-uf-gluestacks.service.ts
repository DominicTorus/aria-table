import { Injectable } from '@nestjs/common';
import { TF_CommonService } from '../tf.common.service';
import * as path from 'path';
import { TFUtilServices } from '../utils/utils';

@Injectable()
export class TfUfGluestacksService {
  constructor(private readonly tfCommonService: TF_CommonService, private readonly utils: TFUtilServices,) { }

  async generateDepandencies(tenantPath: string, appName: string) {
    //.dart_tool
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', '.dart_tool'),);

    // assets
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'assets'),);

    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', '.gitignore(4)',), path.join(tenantPath, 'apps/mobile', 'generated_app', '.gitignore'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', '.metadata',), path.join(tenantPath, 'apps/mobile', 'generated_app', '.metadata'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'analysis_options.yaml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'analysis_options.yaml',));
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'README.ejs',), appName, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'README.md'));

    // PACKAGES
    const packages = [
      {
        name: 'gluestack_ui',
        rootUri: 'C:/Users/rahuls/Downloads/gluestack-ui-flutter-main/gluestack-ui-flutter-main',
        pkgVersion: '0.1.0-beta.4',
        languageVersion: '3.2',
      },
      {
        name: 'http',
        rootUri: '',
        pkgVersion: '1.2.2',
        languageVersion: '3.3',
      },
      {
        name: 'flutter_secure_storage',
        rootUri: '',
        pkgVersion: '9.2.2',
        languageVersion: '2.12',
      },
      {
        name: 'toastification',
        rootUri: '',
        pkgVersion: '2.3.0',
        languageVersion: '3.0',
      },
      {
        name: 'provider',
        rootUri: '',
        pkgVersion: '6.1.2',
        languageVersion: '3.2',
      }
    ];
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'package_config.ejs',), packages, '', appName, '', path.join(tenantPath, 'apps/mobile', 'generated_app/.dart_tool', 'package_config.json',),);
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'pubspec.ejs',), packages, '', appName, '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'pubspec.yaml'),);
  }

  async generatePlatformFiles(tenantPath: string, appName: string) {
    // ANDROID
    // CREATE FOLDER
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/gradle'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/gradle/wrapper'),);

    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/debug'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/profile'),);

    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/java'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/java/io/flutter/plugins'),);

    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/kotlin'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/kotlin/com/example/', appName,),);

    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/drawable',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/drawable-v21',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-hdpi',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-mdpi',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xhdpi',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xxhdpi',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xxxhdpi',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/values',),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/values-night',),);

    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/sys'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/sys/assets'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/sys/assets/png'),);

    // Create a system images
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'logo.png',), path.join(tenantPath, 'apps/mobile', 'generated_app/android/sys/assets/png', 'logo.png'),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gen.png',), path.join(tenantPath, 'apps/mobile', 'generated_app/android/sys/assets/png', 'gen.png'),);

    // WEB
    // CREATE FOLDER
    // await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'web',));
    // await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'web/icons',));


    // CREATE FILES
    // android
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', '.gitignore',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', '.gitignore',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'build.gradle',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'build.gradle',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gradle.properties',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'gradle.properties',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gradlew',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'gradlew',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gradlew.bat',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'gradlew.bat',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'local.properties',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'local.properties',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'settings.gradle',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android', 'settings.gradle',),);
    // android/app
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'build (1).ejs',),), appName, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app', 'build.gradle',),);
    // android/app/src/debug
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'AndroidManifest.xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/debug', 'AndroidManifest.xml',),);    // android/app/src/main
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'AndroidManifest (1).ejs',), appName, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main', 'AndroidManifest.xml',),);
    // android/app/src/main/java
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'GeneratedPluginRegistrant.java',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/java/io/flutter/plugins', 'GeneratedPluginRegistrant.java',),);
    //android/app/src/main/kotlin
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'MainActivity.ejs',), appName, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/kotlin/com/example/', appName, 'MainActivity.kt',),);
    //android/app/src/main/res/drawable
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'launch_background.xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/drawable', 'launch_background.xml',),);
    // android/app/src/main/res/drawable-v21
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'launch_background (1).xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/drawable-v21', 'launch_background.xml',),);
    // android/app/src/main/res/mipmap-hdpi
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'ic_launcher.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-hdpi', 'ic_launcher.png',),);
    // android/app/src/main/res/mipmap-mdpi
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'ic_launcher (1).png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-mdpi', 'ic_launcher.png',),);
    // android/app/src/main/res/mipmap-xhdpi
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'ic_launcher (2).png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xhdpi', 'ic_launcher.png',),);
    // android/app/src/main/res/mipmap-xxhdpi
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'ic_launcher (3).png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xxhdpi', 'ic_launcher.png',),);
    // android/app/src/main/res/mipmap-xxxhdpi
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'ic_launcher (4).png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/mipmap-xxxhdpi', 'ic_launcher.png',),);
    // android/app/src/main/res/values
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'styles.xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/values', 'styles.xml',),);
    // android/app/src/main/res/values-night
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'styles (1).xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/main/res/values-night', 'styles.xml',),);
    // android\app\src\profile
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'AndroidManifest (2).xml',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/app/src/profile', 'AndroidManifest.xml',),);
    //android\gradle\wrapper
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gradle-wrapper.jar',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/gradle/wrapper', 'gradle-wrapper.jar',),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', 'gradle-wrapper.properties',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'android/gradle/wrapper', 'gradle-wrapper.properties',),);

    // web
    // await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web', 'manifest.json',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web', 'manifest.json',),);
    // await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web', 'index.html',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web', 'index.html',),);
    // await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web', 'favicon.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web', 'favicon.png',),);
    // web\icons
    // await this.tfCommonService.copyFile(null,path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web/icons', 'Icon-192.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web/icons', 'Icon-192.png',),);
    // await this.tfCommonService.copyFile(null,path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web/icons', 'Icon-512.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web/icons', 'Icon-512.png',),);
    // await this.tfCommonService.copyFile(null,path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web/icons', 'Icon-maskable-192.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web/icons', 'Icon-maskable-192.png',),);
    // await this.tfCommonService.copyFile(null,path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/web/icons', 'Icon-maskable-512.png',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'web/icons', 'Icon-maskable-512.png',),);
  }

  async createLibraryFiles(tenantPath: string, appName: string) {
    // Create Folder Lib
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib', 'widgets'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib', 'widgets/layout'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/auth'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens'));
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/providers'));

    // Tenant Login
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib', 'app_login.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/auth', 'app_login.dart'));

    // Secure Storage
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/auth/secure_storage'),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib', 'secure_storage.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app/lib/auth/secure_storage', 'secure_storage.dart'),);

    //ENV
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template', '.env.ejs',), appName, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', '.env',),);

    // Utils
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils'),);
    await this.tfCommonService.createFolder(path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils', 'enums'),);
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/common', 'utils_services.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app/lib/utils', 'utils_services.dart'),);

    // ENUm
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_datepicker.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_datepicker.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_dropdown.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_dropdown.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_list.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_list.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_pininput.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_pininput.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_table.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_table.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/enums', 'enum_timepicker.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils/enums', 'enum_timepicker.dart'));


    // Modify base URL here
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/common', 'constants.ejs',), 'http://192.168.2.85:3002', '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils', 'constants.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/common', 'common.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils', 'common.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', '..', 'src/TF/app_template/lib/common', 'apiservices.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/utils', 'apiservices.dart'));
  }

  async createScreenSpecifyFiles(ufs: any, uo: any, ufKey: any,screenName: any, tenantPath: any) {
    let exportedWidgetsByScreen = [];
   
  }
}
