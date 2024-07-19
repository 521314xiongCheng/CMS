export const submenu = {
  activity: true,
  testApplet: true,
  xxxxxxx: true,
  feedback: true,
  dashboard: false,
  permission: true
}

export const PAGE_CONFIGS = {
  xxxxxxx_banner: {
    pageName: 'Banner',
    dataKey: 'banners',
    api: {
      get: 'banners?module=xxxxxxx',
      create: 'banner?module=xxxxxxx',
      edit: {
        url: 'banners/{id}?module=xxxxxxx',
        buildUrlParams: ['form.id']
      },
      del: {
        url: 'banners/{id}?module=xxxxxxx',
        buildUrlParams: ['id']
      },
      online: {
        url: 'banners/{id}/online?module=xxxxxxx',
        buildUrlParams: ['id']
      }
    }
  },
  xxxxxxx_hotChallenge: {
    pageName: 'Hot Challenge',
    dataKey: 'challenges',
    api: {
      get: 'hotChallenges?module=xxxxxxx',
      create: 'hotChallenge?module=xxxxxxx',
      edit: {
        url: 'hotChallenges/{id}?module=xxxxxxx',
        buildUrlParams: ['form.id']
      },
      del: {
        url: 'hotChallenges/{id}?module=xxxxxxx',
        buildUrlParams: ['id']
      },
      online: {
        url: 'hotChallenges/{id}/online?module=xxxxxxx',
        buildUrlParams: ['id']
      }
    }
  },
  xxxxxxx_moreTool: {
    pageName: 'Tool',
    dataKey: 'tools',
    api: {
      get: 'tools?module=xxxxxxx',
      create: 'tool?module=xxxxxxx',
      edit: {
        url: 'tools/{id}?module=xxxxxxx',
        buildUrlParams: ['form.id']
      },
      del: {
        url: 'tools/{id}?module=xxxxxxx',
        buildUrlParams: ['id']
      },
      online: {
        url: 'tools/{id}/online?module=xxxxxxx',
        buildUrlParams: ['id']
      }
    }
  },
  xxxxxxx_recommend: {
    pageName: 'Recommend',
    dataKey: 'recommends',
    api: {
      get: 'recommends?module=xxxxxxx',
      create: 'recommend?module=xxxxxxx',
      edit: {
        url: 'recommends/{id}?module=xxxxxxx',
        buildUrlParams: ['form.id']
      },
      del: {
        url: 'recommends/{id}?module=xxxxxxx',
        buildUrlParams: ['id']
      },
      online: {
        url: 'recommends/{id}/online?module=xxxxxxx',
        buildUrlParams: ['id']
      }
    }
  },
  testApplet_ageRange: {
    pageName: 'Age Range',
    dataKey: 'ageRanges',
    api: {
      get: {
        url: 'ageRanges',
        buildUrlParams: [],
        extraQuery: [
          {
            paramsKey: 'showName',
            valueKey: 'showName'
          }
        ]
      },
      create: 'ageRanges',
      del: {
        url: 'ageRanges/{id}',
        buildUrlParams: ['id']
      },
      edit: {
        url: 'ageRanges/{id}',
        buildUrlParams: ['id']
      }
    }
  },
  testApplet_promotion: {
    pageName: 'Promotion',
    dataKey: 'promotions',
    api: {
      get: 'promotions',
      create: 'promotions',
      del: {
        url: 'promotions/{id}',
        buildUrlParams: ['form.id']
      },
      edit: {
        url: 'promotions/{id}',
        buildUrlParams: ['id']
      }
    }
  },
  testApplet_test: {
    pageName: 'Test',
    dataKey: 'exams',
    api: {
      get: {
        url: 'exams/{examCategoryId}',
        buildUrlParams: ['examCategoryId']
      },
      create: 'exams',
      del: {
        url: 'exams/{id}',
        buildUrlParams: ['id']
      },
      edit: {
        url: 'exams/{id}',
        buildUrlParams: ['id']
      }
    }
  },
  testApplet_category: {
    pageName: 'Category',
    dataKey: 'examCategories',
    api: {
      get: {
        url: 'examCategories',
        buildUrlParams: [],
        extraQuery: [
          {
            paramsKey: 'name',
            valueKey: 'categoryName'
          }
        ]
      },
      create: 'examCategories',
      del: {
        url: 'examCategories/{id}',
        buildUrlParams: ['id']
      },
      edit: {
        url: 'examCategories/{id}',
        buildUrlParams: ['id']
      }
    }
  }
}
